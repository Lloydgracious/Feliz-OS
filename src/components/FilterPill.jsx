import { cn } from '../lib/utils'

export default function FilterPill({ active, label, onClick }) {
  return (
    <button
      className={cn(
        'lux-ring rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        active
          ? 'border-sky-300/60 bg-white/60 text-slate-900'
          : 'border-white/25 bg-white/25 text-slate-700 hover:bg-white/40',
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
