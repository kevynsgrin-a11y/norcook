import Image from 'next/image'
import visuals from '@/lib/imageops-visuals.json'

type VisualId = keyof typeof visuals

export function ImageOpsImage({ id, className, priority = false, sizes = '(max-width: 768px) 100vw, 896px' }: {
  id: Exclude<VisualId, 'shaping'>
  className?: string
  priority?: boolean
  sizes?: string
}) {
  const asset = visuals[id]
  return <Image src={asset.url} alt={asset.alt} width={asset.width} height={asset.height}
    data-imageops-asset={asset.file} priority={priority}
    sizes={sizes} className={className} />
}

export function ImageOpsFigure({ id }: { id: VisualId }) {
  const asset = visuals[id]
  return <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card">
    {id === 'shaping' ? <video src={asset.url} width={asset.width} height={asset.height}
      data-imageops-asset={asset.file} aria-label={asset.alt} controls muted playsInline
      preload="none" className="h-auto w-full">
      This clip illustrates dough shaping. Follow the written recipe instructions.
    </video> : <ImageOpsImage id={id} className="h-auto max-h-[36rem] w-full object-contain" />}
    <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {asset.caption}
    </figcaption>
  </figure>
}
