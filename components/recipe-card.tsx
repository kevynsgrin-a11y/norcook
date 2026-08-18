import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Gauge } from 'lucide-react'
import type { Recipe } from '@/lib/recipes'
import { getRegion } from '@/lib/recipes'
import { SaveRecipeButton } from '@/components/save-recipe-button'

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const region = getRegion(recipe.region)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image || '/placeholder.svg'}
          alt={recipe.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={75}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {region && (
          <Link
            href={`/regions/${region.slug}`}
            // Secondary to "View Recipe"; a grid of twelve cards should not
            // prefetch five hub bundles just by being on screen. As in the
            // header, `false` also disables hover prefetch.
            prefetch={false}
            className="absolute left-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/70"
          >
            {region.name}
          </Link>
        )}

        <SaveRecipeButton slug={recipe.slug} name={recipe.name} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge aria-hidden="true" className="size-3.5" />
            {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock aria-hidden="true" className="size-3.5" />
            {recipe.cookingTime}
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {recipe.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {recipe.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {recipe.mainIngredients.slice(0, 4).map((ing) => (
            <span
              key={ing}
              className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground"
            >
              {ing}
            </span>
          ))}
        </div>

        <Link
          href={`/recipes/${recipe.slug}`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          View Recipe
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
