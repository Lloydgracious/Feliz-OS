import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function KnotCard({ knot, selected, onSelect, rightNote }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onClick={() => onSelect?.(knot)}
      className={cn(
        'lux-ring lux-glass group w-full rounded-3xl p-4 text-left',
        selected && 'border-sky-300/70 bg-white/20',
      )}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img src={knot.image} alt={knot.name} className="h-44 w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent" />
        <div
          className={cn(
            'absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold',
            selected ? 'bg-sky-600 text-white' : 'bg-white/70 text-slate-900',
          )}
        >
          {knot.meaning}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900">{knot.name}</div>
            {rightNote && <div className="mt-0.5 text-xs font-semibold text-slate-700">{rightNote}</div>}
          </div>
          <div
            className={cn(
              'h-2.5 w-2.5 rounded-full transition',
              selected ? 'bg-sky-600 shadow-[0_0_0_4px_rgba(124,199,255,0.25)]' : 'bg-white/60',
            )}
          />
        </div>
        <div className="mt-2 text-sm text-slate-700">{knot.description}</div>
      </div>
    </motion.button>
  )
}
