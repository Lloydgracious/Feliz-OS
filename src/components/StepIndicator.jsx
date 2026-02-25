import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function StepIndicator({ steps, activeIndex, onStep }) {
  return (
    <div className="lux-glass rounded-3xl px-4 py-3">
      <div className="relative grid grid-cols-5 gap-2">
        {steps.map((s, idx) => {
          const active = idx === activeIndex
          const done = idx < activeIndex
          return (
            <button
              key={s.key}
              onClick={() => onStep?.(idx)}
              type="button"
              className={cn(
                'lux-ring relative rounded-2xl px-3 py-3 text-left transition hover:bg-white/25',
                active && 'bg-white/35',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-2xl text-xs font-semibold',
                    active
                      ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white'
                      : done
                        ? 'bg-white/70 text-slate-900'
                        : 'bg-white/35 text-slate-700',
                  )}
                >
                  {idx + 1}
                </div>
                <div className="hidden text-sm font-semibold text-slate-900 md:block">{s.label}</div>
              </div>
              {active && (
                <motion.div
                  layoutId="step-underline"
                  className="absolute inset-x-5 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-sky-400 to-blue-600"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
