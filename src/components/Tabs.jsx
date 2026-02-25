import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('relative flex flex-wrap gap-2', className)}>
      {tabs.map((t) => {
        const is = t.id === active
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              'relative rounded-2xl px-4 py-2 text-sm font-semibold transition',
              is ? 'text-slate-900' : 'text-slate-600 hover:text-slate-800',
            )}
          >
            <span className={cn('relative z-10')}>{t.label}</span>
            {is && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-2xl border border-white/25 bg-white/35"
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
