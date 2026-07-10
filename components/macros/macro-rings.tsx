import type { Macros } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * MacroRings — three concentric SVG rings visualizing the macronutrient split
 * (protein / carbs / fats) by calorie contribution, with total calories in the
 * center. Designed to sit in the top-right corner of a video frame.
 */

const CAL_PER_G = { protein: 4, carbs: 4, fats: 9 } as const

interface MacroRingsProps {
  macros: Macros
  size?: number
  className?: string
}

export function MacroRings({ macros, size = 76, className }: MacroRingsProps) {
  const kcal = {
    protein: macros.protein * CAL_PER_G.protein,
    carbs: macros.carbs * CAL_PER_G.carbs,
    fats: macros.fats * CAL_PER_G.fats,
  }
  const totalKcal = kcal.protein + kcal.carbs + kcal.fats || 1

  const rings = [
    { key: 'protein', frac: kcal.protein / totalKcal, color: 'var(--protein)', r: 34 },
    { key: 'carbs', frac: kcal.carbs / totalKcal, color: 'var(--carbs)', r: 26 },
    { key: 'fats', frac: kcal.fats / totalKcal, color: 'var(--fats)', r: 18 },
  ]

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        role="img"
        aria-label={`Macros: ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fats}g fat, ${macros.calories} calories`}
      >
        {rings.map((ring) => {
          const circumference = 2 * Math.PI * ring.r
          return (
            <g key={ring.key} transform="rotate(-90 40 40)">
              <circle
                cx="40"
                cy="40"
                r={ring.r}
                fill="none"
                stroke="oklch(1 0 0 / 0.16)"
                strokeWidth="5"
              />
              <circle
                cx="40"
                cy="40"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${circumference * ring.frac} ${circumference}`}
              />
            </g>
          )
        })}
        <text
          x="40"
          y="38"
          textAnchor="middle"
          className="fill-foreground font-mono"
          fontSize="15"
          fontWeight="700"
        >
          {macros.calories}
        </text>
        <text
          x="40"
          y="50"
          textAnchor="middle"
          className="fill-foreground/70"
          fontSize="8"
          letterSpacing="0.5"
        >
          KCAL
        </text>
      </svg>
    </div>
  )
}

/** Compact legend mapping ring colors to macro grams. */
export function MacroLegend({ macros }: { macros: Macros }) {
  const items = [
    { label: 'Protein', value: macros.protein, color: 'var(--protein)' },
    { label: 'Carbs', value: macros.carbs, color: 'var(--carbs)' },
    { label: 'Fats', value: macros.fats, color: 'var(--fats)' },
  ]
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-sm">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="text-muted-foreground">{item.label}</span>
          <span className="font-mono font-semibold">{item.value}g</span>
        </li>
      ))}
    </ul>
  )
}
