import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const origin = 'https://www.norcook.app'
const digest = bytes => createHash('sha256').update(bytes).digest('hex')

export function verifyRoute(html, assets) {
  // Match actual elements, never URLs in metadata or Next's Flight payload.
  const tags = html.match(/<(?:img|video)\b[^>]*>/g) ?? []
  for (const asset of assets) {
    assert(tags.some(tag => {
      const marker = tag.match(/\bdata-imageops-asset="([^"]+)"/)?.[1]
      const src = tag.match(/\ssrc="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&')
      if (marker !== asset.file || !src) return false
      const url = new URL(src, origin)
      if (url.origin !== origin) return false
      return (url.pathname === asset.url ||
        (url.pathname === '/_next/image' && url.searchParams.get('url') === asset.url)) &&
        (asset.mime === 'video/mp4' ? tag.startsWith('<video') : tag.startsWith('<img'))
    }), `Missing actual media element for ${asset.file}`)
  }
}

async function makeReceipt() {
  const visuals = JSON.parse(await readFile('lib/imageops-visuals.json', 'utf8'))
  const manifest = await readFile('public/imageops.manifest.md', 'utf8')
  const rows = manifest.split(/\r?\n/).filter(line => /^\| [^|]+\.(webp|mp4) \|/.test(line))
    .map(line => line.split('|').slice(1, -1).map(cell => cell.trim()))
  const files = new Set()
  const assets = []
  for (const [id, asset] of Object.entries(visuals)) {
    assert(['A', 'B', 'C'].includes(asset.grade), `Unapproved grade: ${id}`)
    assert(!files.has(asset.file), `Duplicate file: ${asset.file}`)
    files.add(asset.file)
    assert(/^\/assets\/(img|video)\/[a-z0-9-]+\.(webp|mp4)$/.test(asset.url), `Unsafe URL: ${id}`)
    assert(asset.url.split('/').pop() === asset.file, `File/URL mismatch: ${id}`)
    assert(asset.alt && asset.caption && asset.role && asset.routes.length, `Missing placement detail: ${id}`)
    assert(asset.routes.every(route => /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route)), `Unsafe route: ${id}`)
    assert(rows.some(row => row[0] === asset.file && row[2] === asset.url && row[5] === asset.grade), `Manifest mismatch: ${id}`)
    const bytes = await readFile(resolve('public', `.${asset.url}`))
    const mime = asset.url.endsWith('.mp4') ? 'video/mp4' : 'image/webp'
    if (mime === 'image/webp') {
      const metadata = await sharp(bytes).metadata()
      assert(metadata.format === 'webp' && metadata.width === asset.width && metadata.height === asset.height, `Dimension/format mismatch: ${id}`)
    } else {
      assert(bytes.subarray(4, 8).toString() === 'ftyp', `Not an MP4: ${id}`)
    }
    assets.push({ id, ...asset, mime, bytes: bytes.length, sha256: digest(bytes) })
  }
  assert.equal(assets.length, 11, 'This reviewed release must cover all eleven Norcook assets')
  assert.equal(rows.length, assets.length, 'Manifest assets missing from placement review')
  return { format: '2eyes-source-placement-v1', releaseId: 'norcook-images-20260905-1',
    origin, repository: 'kevynsgrin-a11y/norcook', branch: 'main',
    host: { provider: 'vercel', project: 'nordic-culinary-platform', root: '.' },
    assets }
}

async function checkedFetch(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000), redirect: 'error' })
  assert.equal(response.status, 200, `${url}: HTTP ${response.status}`)
  return response
}

async function main() {
  const receipt = await makeReceipt()
  if (process.argv.includes('--write')) {
    await writeFile('public/imageops.release.json', `${JSON.stringify(receipt, null, 2)}\n`)
  }
  const committed = JSON.parse(await readFile('public/imageops.release.json', 'utf8'))
  assert.deepEqual(committed, receipt, 'Stale release receipt: review changes, then run with --write')
  if (!process.argv.includes('--live')) {
    console.log(`Visual release checks pass: ${receipt.assets.length} approved assets with exact hashes and placements.`)
    return
  }
  const liveReceipt = await checkedFetch(`${origin}/imageops.release.json`)
  assert.match(liveReceipt.headers.get('content-type') ?? '', /application\/json/)
  assert.deepEqual(await liveReceipt.json(), receipt, 'Production release receipt does not match this checkout')
  // Bound concurrency; a missing or stale asset fails the entire verification.
  for (let offset = 0; offset < receipt.assets.length; offset += 4) {
    await Promise.all(receipt.assets.slice(offset, offset + 4).map(async asset => {
      const response = await checkedFetch(`${origin}${asset.url}`)
      assert.equal(response.headers.get('content-type')?.split(';')[0], asset.mime, `MIME: ${asset.file}`)
      assert.equal(digest(Buffer.from(await response.arrayBuffer())), asset.sha256, `SHA-256: ${asset.file}`)
    }))
  }
  const routes = [...new Set(receipt.assets.flatMap(asset => asset.routes))]
  for (const route of routes) {
    const response = await checkedFetch(`${origin}${route}`)
    assert.match(response.headers.get('content-type') ?? '', /text\/html/)
    verifyRoute(await response.text(), receipt.assets.filter(asset => asset.routes.includes(route)))
  }
  console.log(JSON.stringify({ verifiedAt: new Date().toISOString(), releaseId: receipt.releaseId,
    origin, assetHashesAndMimes: receipt.assets.length, renderedRoutes: routes.length, failures: [] }, null, 2))
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
