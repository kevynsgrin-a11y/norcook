import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imageRoot = path.join(process.cwd(), 'public', 'images')
const HERO_BUDGET_BYTES = 300 * 1024
const CARD_BUDGET_BYTES = 180 * 1024
const HERO_MAX_WIDTH = 1920
const CARD_MAX_WIDTH = 1200
const heroFiles = new Set([
  'hero-fjord.webp',
  'newsletter-tundra.webp',
  'recipe-header.webp',
])

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directory, entry.name)
        return entry.isDirectory() ? collectFiles(entryPath) : [entryPath]
      }),
    )
  ).flat()
}

const failures = []
const files = await collectFiles(imageRoot)
for (const filePath of files) {
  const filename = path.basename(filePath)
  if (path.extname(filePath).toLowerCase() !== '.webp') {
    failures.push(`${path.relative(process.cwd(), filePath)} is not WebP`)
    continue
  }

  const isHero = heroFiles.has(filename)
  const byteBudget = isHero ? HERO_BUDGET_BYTES : CARD_BUDGET_BYTES
  const widthBudget = isHero ? HERO_MAX_WIDTH : CARD_MAX_WIDTH
  const [{ size }, metadata] = await Promise.all([stat(filePath), sharp(filePath).metadata()])
  if (size > byteBudget) {
    failures.push(
      `${path.relative(process.cwd(), filePath)} is ${Math.ceil(size / 1024)} KiB (budget ${byteBudget / 1024} KiB)`,
    )
  }
  if ((metadata.width ?? 0) > widthBudget) {
    failures.push(
      `${path.relative(process.cwd(), filePath)} is ${metadata.width}px wide (budget ${widthBudget}px)`,
    )
  }
}

const nextConfig = await readFile(path.join(process.cwd(), 'next.config.mjs'), 'utf8')
if (!nextConfig.includes("formats: ['image/avif', 'image/webp']")) {
  failures.push('next.config.mjs must negotiate AVIF and WebP output')
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}

console.log(
  `Image budgets pass: ${files.length} WebP sources, hero ≤ ${HERO_BUDGET_BYTES / 1024} KiB, cards ≤ ${CARD_BUDGET_BYTES / 1024} KiB.`,
)
