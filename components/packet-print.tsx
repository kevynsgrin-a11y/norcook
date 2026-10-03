'use client'

import { useEffect } from 'react'

/** Wires the packet jump-bar Print button (the contract's cook-path control). */
export function PacketPrintHandler() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest?.('[data-action="print"]')) window.print()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
