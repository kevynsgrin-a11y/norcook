/**
 * Themed skeleton for the Recipe Detail route — mirrors the video canvas +
 * ingredient/method aside so the layout stays stable while data streams in.
 */
export default function RecipeLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
      <div className="mb-6 h-4 w-28 rounded skeleton" aria-hidden="true" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* video canvas */}
        <div
          className="aspect-[9/16] max-h-[80vh] w-full rounded-3xl skeleton sm:aspect-video lg:aspect-[4/5]"
          aria-hidden="true"
        />
        {/* aside */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full skeleton" aria-hidden="true" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 rounded skeleton" aria-hidden="true" />
              <div className="h-3 w-40 rounded skeleton" aria-hidden="true" />
            </div>
          </div>
          <div className="h-16 w-full rounded-xl skeleton" aria-hidden="true" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl skeleton" aria-hidden="true" />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-full rounded skeleton" aria-hidden="true" />
            ))}
          </div>
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        Loading recipe
      </span>
    </div>
  )
}
