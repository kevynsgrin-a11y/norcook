import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import lighthouse, { desktopConfig } from 'lighthouse'
import { computeMedianRun } from 'lighthouse/core/lib/median-run.js'
import * as chromeLauncher from 'chrome-launcher'
import { chromium } from '@playwright/test'

const profileName = process.argv[2]

if (profileName !== 'mobile' && profileName !== 'desktop') {
  throw new Error('Usage: node scripts/run-lighthouse.mjs <mobile|desktop>')
}

const BASE_URL = 'http://127.0.0.1:3000'
const PATHS = ['/', '/recipes/gravlaks', '/regions/vestlandet']
const BROWSER_PROFILE_ROOT = join(process.cwd(), '.lighthouse-runner-profiles')
// The project pins this browser through Playwright, so the local and CI
// performance gate does not silently change behavior when a developer's
// system Chrome auto-updates. A managed CI browser can still be selected with
// LIGHTHOUSE_CHROME_PATH when deliberately required.
const LIGHTHOUSE_CHROME_PATH = process.env.LIGHTHOUSE_CHROME_PATH ?? chromium.executablePath()
// Lighthouse itself documents intermittent NO_NAVSTART traces. Retry only a
// report with no usable metrics; a valid report still faces every release
// threshold below. Five attempts avoids treating this known runner defect as a
// product result while keeping the failure bounded and visible.
const MAX_INVALID_TRACE_ATTEMPTS = 5
let chromeRunNumber = 0

const PROFILES = {
  mobile: {
    runs: 3,
    categoryMinimums: {
      performance: 0.75,
      accessibility: 0.95,
      'best-practices': 0.95,
      seo: 0.95,
    },
    auditMaximums: {
      'first-contentful-paint': 2200,
      'largest-contentful-paint': 3500,
      'cumulative-layout-shift': 0.1,
      'total-blocking-time': 600,
    },
    flags: {
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2 },
    },
    config: undefined,
  },
  desktop: {
    runs: 1,
    categoryMinimums: {
      performance: 0.85,
      accessibility: 0.95,
      'best-practices': 0.95,
      seo: 0.95,
    },
    auditMaximums: {
      'first-contentful-paint': 1600,
      'largest-contentful-paint': 2500,
      'cumulative-layout-shift': 0.1,
      'total-blocking-time': 200,
    },
    flags: { formFactor: 'desktop' },
    config: desktopConfig,
  },
}

const profile = PROFILES[profileName]

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function routeName(path) {
  return path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')
}

async function startServer() {
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3000'],
    {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  let output = ''
  const recordOutput = (chunk) => {
    output += chunk.toString()
  }
  server.stdout.on('data', recordOutput)
  server.stderr.on('data', recordOutput)

  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited before becoming ready:\n${output}`)
    }

    try {
      const response = await fetch(BASE_URL)
      if (response.ok) return server
    } catch {
      // The polling window is intentionally quiet while Next starts.
    }

    await sleep(200)
  }

  server.kill()
  throw new Error(`next start did not become ready within 30 seconds:\n${output}`)
}

async function stopServer(server) {
  if (server.exitCode !== null) return

  server.kill()
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    sleep(5_000),
  ])
}

async function runLighthouse(url) {
  let lastFailure = 'Lighthouse did not return a report'

  for (let attempt = 1; attempt <= MAX_INVALID_TRACE_ATTEMPTS; attempt += 1) {
    const userDataDir = join(
      BROWSER_PROFILE_ROOT,
      `${profileName}-${process.pid}-${Date.now()}-${chromeRunNumber}`,
    )
    chromeRunNumber += 1
    await mkdir(userDataDir, { recursive: true })

    let chrome

    try {
      chrome = await chromeLauncher.launch({
        chromePath: LIGHTHOUSE_CHROME_PATH,
        userDataDir,
        chromeFlags: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-component-update',
          '--disable-sync',
          '--no-first-run',
        ],
      })
      const result = await lighthouse(
        url,
        {
          logLevel: 'error',
          output: 'json',
          port: chrome.port,
          ...profile.flags,
        },
        profile.config,
      )
      const lhr = result?.lhr

      if (!lhr) {
        lastFailure = 'Lighthouse did not return a report'
      } else if (lhr.runtimeError || typeof lhr.categories.performance?.score !== 'number') {
        lastFailure = lhr.runtimeError?.message ?? 'Lighthouse returned an incomplete trace'
      } else {
        return lhr
      }
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error)
    } finally {
      if (chrome) await chrome.kill()
    }

    if (attempt < MAX_INVALID_TRACE_ATTEMPTS) {
      console.warn(
        `[${profileName}] ${url} returned an invalid trace; retrying (${attempt}/${MAX_INVALID_TRACE_ATTEMPTS})`,
      )
    }
  }

  throw new Error(`${url} did not produce a valid Lighthouse trace: ${lastFailure}`)
}

// Audits below Lighthouse's 0.9 "good" threshold are the ones that dragged a
// category under its gate; surface them (with a bounded excerpt of details)
// instead of leaving the reader to guess from the score alone.
const FAILING_AUDIT_SCORE = 0.9
const MAX_DETAIL_ITEMS = 3

function describeDetailItem(item) {
  const label =
    item.url ??
    item.source?.url ??
    item.sourceUrl ??
    item.label ??
    item.value ??
    item.text ??
    item.description
  // JSON.stringify(undefined) returns undefined, and some Lighthouse detail
  // items carry none of the label fields — fall back to the whole item so the
  // excerpt can never crash the gate it is reporting for.
  const text = typeof label === 'string' ? label : JSON.stringify(label ?? item)
  return text.length > 160 ? `${text.slice(0, 157)}...` : text
}

function failingAuditLines(medianReport, categoryId) {
  const category = medianReport.categories[categoryId]
  if (!category) return []

  return category.auditRefs
    .map((ref) => medianReport.audits[ref.id])
    .filter(
      (audit) => audit && typeof audit.score === 'number' && audit.score < FAILING_AUDIT_SCORE,
    )
    .map((audit) => {
      const items = Array.isArray(audit.details?.items)
        ? audit.details.items.slice(0, MAX_DETAIL_ITEMS)
        : []
      const detailLines = items.map(
        (item) => `      · ${describeDetailItem(item)}`,
      )
      return [
        `    - ${audit.id} "${audit.title}" (score ${audit.score})`,
        ...detailLines,
      ].join('\n')
    })
}

function getAuditNumber(lhr, auditId) {
  const value = lhr.audits[auditId]?.numericValue
  if (typeof value !== 'number') {
    throw new Error(`Lighthouse report is missing numeric audit ${auditId}`)
  }
  return value
}

function getTransferSize(lhr, resourceType) {
  const items = lhr.audits['resource-summary']?.details?.items
  const item = Array.isArray(items)
    ? items.find((candidate) => candidate.resourceType === resourceType)
    : undefined

  if (!item || typeof item.transferSize !== 'number') {
    throw new Error(`Lighthouse resource summary is missing ${resourceType} transfer size`)
  }

  return item.transferSize
}

function thirdPartyRequests(lhr, url) {
  const items = lhr.audits['network-requests']?.details?.items
  if (!Array.isArray(items)) {
    throw new Error(`${url} Lighthouse report is missing network request data`)
  }

  const firstPartyOrigin = new URL(url).origin
  return items
    .map((item) => item.url)
    .filter((requestUrl) => {
      if (typeof requestUrl !== 'string' || !requestUrl.startsWith('http')) return false
      return new URL(requestUrl).origin !== firstPartyOrigin
    })
}

function median(values) {
  const sorted = [...values].sort((left, right) => left - right)
  return sorted[Math.floor(sorted.length / 2)]
}

function assertReleaseBudgets(reports, url, resourceBudgets) {
  const metricMedians = {
    categoryScores: {},
    audits: {},
    transferSizes: {},
  }
  const failures = []
  const medianReport = reports.length === 1 ? reports[0] : computeMedianRun(reports)

  const collect = (message, auditLines = []) => {
    failures.push(message)
    console.error(`  FAIL ${message}`)
    for (const line of auditLines) console.error(line)
  }

  for (const [category, minimum] of Object.entries(profile.categoryMinimums)) {
    const scores = reports.map((report) => report.categories[category]?.score)
    if (scores.some((score) => typeof score !== 'number')) {
      collect(`${url} report is missing category ${category}`)
      continue
    }

    const value = median(scores)
    metricMedians.categoryScores[category] = value
    if (value < minimum) {
      collect(
        `${url} category ${category}: expected at least ${minimum}, received ${value}`,
        failingAuditLines(medianReport, category),
      )
    }
  }

  for (const [auditId, maximum] of Object.entries(profile.auditMaximums)) {
    let value
    try {
      value = median(reports.map((report) => getAuditNumber(report, auditId)))
    } catch (error) {
      collect(error instanceof Error ? error.message : String(error))
      continue
    }

    metricMedians.audits[auditId] = value
    if (value > maximum) {
      collect(`${url} audit ${auditId}: expected at most ${maximum}, received ${value}`)
    }
  }

  for (const [resourceType, maximum] of Object.entries(resourceBudgets)) {
    let value
    try {
      value = median(reports.map((report) => getTransferSize(report, resourceType)))
    } catch (error) {
      collect(error instanceof Error ? error.message : String(error))
      continue
    }

    metricMedians.transferSizes[resourceType] = value
    if (value > maximum) {
      collect(
        `${url} ${resourceType} transfer size: expected at most ${maximum}, received ${value}`,
      )
    }
  }

  // A third-party request is never an acceptable outlier for this property;
  // enforce it on every valid sample rather than only on the median.
  for (const report of reports) {
    try {
      const thirdPartyUrls = thirdPartyRequests(report, url)
      if (thirdPartyUrls.length > 0) {
        collect(`${url} loaded third-party requests: ${thirdPartyUrls.join(', ')}`)
      }
    } catch (error) {
      collect(error instanceof Error ? error.message : String(error))
    }
  }

  if (failures.length > 0) {
    throw new Error(
      `Release budgets failed for ${url} — ${failures.length} assertion${failures.length === 1 ? '' : 's'}:\n` +
        failures.map((failure) => `  - ${failure}`).join('\n'),
    )
  }

  return metricMedians
}

async function getResourceBudgets() {
  const source = await readFile(join(process.cwd(), 'performance-budget.json'), 'utf8')
  const resourceSizes = JSON.parse(source)[0]?.resourceSizes
  if (!Array.isArray(resourceSizes)) {
    throw new Error('performance-budget.json must contain resource size budgets')
  }

  const byType = new Map(resourceSizes.map((entry) => [entry.resourceType, entry.budget]))
  const requiredTypes = ['script', 'image', 'stylesheet', 'total']

  return Object.fromEntries(
    requiredTypes.map((resourceType) => {
      const kibibytes = byType.get(resourceType)
      if (typeof kibibytes !== 'number') {
        throw new Error(`performance-budget.json is missing a ${resourceType} budget`)
      }
      return [resourceType, kibibytes * 1024]
    }),
  )
}

const outputDirectory = join(process.cwd(), '.lighthouseci', profileName)
const resourceBudgets = await getResourceBudgets()
await mkdir(outputDirectory, { recursive: true })
await mkdir(BROWSER_PROFILE_ROOT, { recursive: true })

const server = await startServer()
const manifest = []

try {
  for (const path of PATHS) {
    const url = `${BASE_URL}${path}`
    const reports = []

    for (let run = 1; run <= profile.runs; run += 1) {
      console.log(`[${profileName}] ${path} — run ${run}/${profile.runs}`)
      const report = await runLighthouse(url)
      reports.push(report)
      await writeFile(
        join(outputDirectory, `${routeName(path)}-run-${run}.json`),
        `${JSON.stringify(report, null, 2)}\n`,
      )
    }

    const metricMedians = assertReleaseBudgets(reports, url, resourceBudgets)
    const representative = reports.length === 1 ? reports[0] : computeMedianRun(reports)
    await writeFile(
      join(outputDirectory, `${routeName(path)}-representative.json`),
      `${JSON.stringify(representative, null, 2)}\n`,
    )

    manifest.push({
      url,
      runs: profile.runs,
      runReports: reports.map((_, index) => `${routeName(path)}-run-${index + 1}.json`),
      representativeReport: `${routeName(path)}-representative.json`,
      metricMedians,
    })
  }

  await writeFile(
    join(outputDirectory, 'manifest.json'),
    `${JSON.stringify({ profile: profileName, generatedAt: new Date().toISOString(), routes: manifest }, null, 2)}\n`,
  )
} finally {
  await stopServer(server)
}

// Chrome launcher can leave a closed child handle referenced on Windows even
// after every report write and cleanup action above has completed. This is a
// standalone release-gate CLI, so an explicit successful exit prevents a
// completed audit from hanging the job. Errors throw before reaching here.
process.exit(0)
