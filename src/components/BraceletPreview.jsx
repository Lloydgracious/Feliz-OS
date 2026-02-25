import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function BraceletPreview({ primary, secondary, knotLabel }) {
  const primaryHex = primary?.hex ?? '#7cc7ff'
  const secondaryHex = secondary?.hex ?? '#ffffff'

  return (
    <div className="lux-glass rounded-[32px] p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">LIVE PREVIEW</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{knotLabel ?? 'Custom Knot'}</div>
          <div className="mt-1 text-sm text-slate-700">
            {primary?.name ?? 'Sky Blue'} + {secondary?.name ?? 'White Jade'}
          </div>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 opacity-80" />
      </div>

      <div className="mt-7 grid place-items-center">
        <motion.div
          key={`${primaryHex}-${secondaryHex}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative h-44 w-full max-w-md"
        >
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950/5" />

          <div
            className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                `conic-gradient(from 120deg, ${primaryHex}, ${primaryHex} 40%, ${secondaryHex} 40%, ${secondaryHex} 75%, ${primaryHex} 75%)`,
              filter: 'blur(0px)',
            }}
          />

          <div
            className={cn(
              'absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/35',
            )}
            style={{
              background: `linear-gradient(145deg, ${secondaryHex}cc, ${primaryHex}55)`,
              boxShadow: '0 20px 60px rgba(2,16,36,0.18)',
            }}
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-slate-900">
              Knot • {knotLabel ?? '—'}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-700">
        <div className="rounded-2xl border border-white/20 bg-white/20 px-4 py-3">
          <div className="text-xs text-slate-600">Primary</div>
          <div className="mt-1 font-semibold text-slate-900">{primary?.name ?? 'Sky Blue'}</div>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/20 px-4 py-3">
          <div className="text-xs text-slate-600">Secondary</div>
          <div className="mt-1 font-semibold text-slate-900">{secondary?.name ?? 'White Jade'}</div>
        </div>
      </div>
    </div>
  )
}
