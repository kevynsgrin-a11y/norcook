'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const STORAGE_KEY = 'nordisk-favorites'

type FavoritesContextValue = {
  /** Slugs the reader has saved. Empty until hydrated from localStorage. */
  favorites: string[]
  isSaved: (slug: string) => boolean
  toggle: (slug: string) => void
  /** True once the client has read localStorage — guards against SSR flicker. */
  hydrated: boolean
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
)

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setFavorites(read())
    setHydrated(true)

    // Keep multiple tabs in sync. A null key means the other tab called
    // localStorage.clear(), which should also reset our copy.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) setFavorites(read())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore quota / privacy-mode errors */
      }
      return next
    })
  }, [])

  const isSaved = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  )

  const value = useMemo(
    () => ({ favorites, isSaved, toggle, hydrated }),
    [favorites, isSaved, toggle, hydrated],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
