import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { Plus, Minus } from 'lucide-react'

export default function KnotCard({ knot, count = 0, onAdd, onRemove, rightNote }) {
  const selected = count > 0

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn(
        'lux-ring lux-glass group w-full rounded-3xl p-4 text-left relative',
        selected && 'ring-2 ring-feliz-blue/40',
      )}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img src={knot.image} alt={knot.name} className="h-44 w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent" />
        <div
          className={cn(
            'absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold',
            selected ? 'bg-feliz-blue text-white' : 'bg-white/70 text-slate-900',
          )}
        >
          {knot.meaning}
        </div>

        {/* Count badge */}
        {selected && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-feliz-yellow text-[13px] font-bold text-slate-900 shadow-md">
            {count}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900">{knot.name}</div>
            {rightNote && <div className="mt-0.5 text-xs font-semibold text-slate-700">{rightNote}</div>}
          </div>
        </div>
        <div className="mt-2 text-sm text-slate-700">{knot.description}</div>

        {/* +/- controls */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove?.(knot) }}
            disabled={count === 0}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl border transition',
              count === 0
                ? 'border-white/10 bg-white/10 text-slate-400 cursor-not-allowed'
                : 'border-rose-200 bg-rose-50/50 text-rose-500 hover:bg-rose-100/60'
            )}
            aria-label="Remove one"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>

          <span className="flex-1 text-center text-sm font-semibold text-slate-800">
            {count === 0 ? 'Not selected' : `× ${count}`}
          </span>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onAdd?.(knot) }}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-feliz-blue/30 bg-feliz-blue/10 text-feliz-blue transition hover:bg-feliz-blue/20"
            aria-label="Add one"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
