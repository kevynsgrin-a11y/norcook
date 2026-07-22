import { readdir, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imageRoot = path.join(process.cwd(), 'public', 'images')

async function collectPngs(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return collectPngs(entryPath)
      return entry.name.toLowerCase().endsWith('.png') ? [entryPath] : []
    }),
  )
  return nested.flat()
}

function profileFor(filePath) {
  const filename = path.basename(filePath)
  if (filename === 'hero-fjord.png') return { width: 1920, quality: 78 }
  if (filename === 'newsletter-tundra.png') return { width: 1600, quality: 76 }
  if (filename === 'recipe-header.png') return { width: 1600, quality: 76 }
  return { width: 1200, quality: 72 }
}

async function optimize(filePath) {
  const { width, quality } = profileFor(filePath)
  const destination = filePath.replace(/\.png$/i, '.webp')
  const temporaryDestination = `${destination}.tmp`
  await sharp(filePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(temporaryDestination)
  await rename(temporaryDestination, destination)
  await unlink(filePath)
  return path.relative(process.cwd(), destination)
}

const files = await collectPngs(imageRoot)
for (const filePath of files) {
  const destination = await optimize(filePath)
  console.log(`Optimized ${destination}`)
}
console.log(`Optimized ${files.length} image${files.length === 1 ? '' : 's'}.`)
