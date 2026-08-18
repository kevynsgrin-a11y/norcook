/**
 * Device-local saved-recipe store.
 *
 * Favourites live in localStorage under one key per recipe so that a single
 * write never has to rewrite the whole collection. Nothing here reaches the
 * network: the store is the entire feature, and it is per-device by design.
 *
 * Components read through `useSyncExternalStore`, so `getSavedSlugs` returns a
 * cached array that only changes identity when the collection actually changes.
 * Writes notify the current document with a `CustomEvent` and other tabs through
 * the native `storage` event, which does not fire for same-document writes.
 */

export const FAVORITE_PREFIX = 'norcook-favorite:'

const CHANGE_EVENT = 'norcook:favorites'
const EMPTY: readonly string[] = Object.freeze([])

let cachedSlugs: readonly string[] | null = null

export function favoriteKey(slug: string) {
  return `${FAVORITE_PREFIX}${slug}`
}

/** localStorage throws outright in some private-mode and blocked-cookie setups. */
function readStore(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function notify() {
  cachedSlugs = null
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function isSaved(slug: string): boolean {
  return readStore()?.getItem(favoriteKey(slug)) === 'true'
}

export function setSaved(slug: string, saved: boolean) {
  const store = readStore()
  if (!store) return
  try {
    if (saved) store.setItem(favoriteKey(slug), 'true')
    else store.removeItem(favoriteKey(slug))
  } catch {
    // Quota or permission failure: leave the collection as it was.
    return
  }
  notify()
}

export function clearAll() {
  const store = readStore()
  if (!store) return
  try {
    const keys: string[] = []
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i)
      if (key?.startsWith(FAVORITE_PREFIX)) keys.push(key)
    }
    keys.forEach((key) => store.removeItem(key))
  } catch {
    return
  }
  notify()
}

/** Stable across renders until a write invalidates it — required by useSyncExternalStore. */
export function getSavedSlugs(): readonly string[] {
  if (cachedSlugs) return cachedSlugs
  const store = readStore()
  if (!store) {
    cachedSlugs = EMPTY
    return cachedSlugs
  }
  const slugs: string[] = []
  try {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i)
      if (key?.startsWith(FAVORITE_PREFIX) && store.getItem(key) === 'true') {
        slugs.push(key.slice(FAVORITE_PREFIX.length))
      }
    }
  } catch {
    cachedSlugs = EMPTY
    return cachedSlugs
  }
  cachedSlugs = slugs.length ? Object.freeze(slugs) : EMPTY
  return cachedSlugs
}

/** The server renders no saved recipes; hydration reconciles from there. */
export function getEmptySlugs(): readonly string[] {
  return EMPTY
}

export function subscribe(onChange: () => void) {
  const onSameDocument = () => onChange()
  // `event.key === null` is a whole-store clear from another tab.
  const onOtherTab = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(FAVORITE_PREFIX)) {
      cachedSlugs = null
      onChange()
    }
  }
  window.addEventListener(CHANGE_EVENT, onSameDocument)
  window.addEventListener('storage', onOtherTab)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onSameDocument)
    window.removeEventListener('storage', onOtherTab)
  }
}

const noopSubscribe = () => () => {}

/** Shared with `useSyncExternalStore` to tell a hydrating render from a live one. */
export const hydrationStore = {
  subscribe: noopSubscribe,
  getSnapshot: () => true,
  getServerSnapshot: () => false,
}
