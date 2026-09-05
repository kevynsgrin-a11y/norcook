import assert from 'node:assert/strict'
import test from 'node:test'
import { verifyRoute } from './imageops-release.mjs'

const image = { file: 'sample.webp', url: '/assets/img/sample.webp', mime: 'image/webp' }
test('accepts exact source and Next Image URLs on actual image elements', () => {
  verifyRoute('<img src="/assets/img/sample.webp" data-imageops-asset="sample.webp">', [image])
  verifyRoute('<img data-imageops-asset="sample.webp" src="/_next/image?url=%2Fassets%2Fimg%2Fsample.webp&amp;w=640&amp;q=75">', [image])
})
test('rejects metadata-only, wrong asset and external image references', () => {
  for (const html of [
    '<meta data-imageops-asset="sample.webp" src="/assets/img/sample.webp">',
    '<img data-imageops-asset="sample.webp" src="/assets/img/wrong.webp">',
    '<img data-imageops-asset="sample.webp" src="https://example.com/assets/img/sample.webp">',
    '<video data-imageops-asset="sample.webp" src="/assets/img/sample.webp">',
  ]) assert.throws(() => verifyRoute(html, [image]))
})
test('requires a video element for technique clips', () => {
  const video = { file: 'sample.mp4', url: '/assets/video/sample.mp4', mime: 'video/mp4' }
  verifyRoute('<video data-imageops-asset="sample.mp4" src="/assets/video/sample.mp4" controls>', [video])
  assert.throws(() => verifyRoute('<img data-imageops-asset="sample.mp4" src="/assets/video/sample.mp4">', [video]))
})
