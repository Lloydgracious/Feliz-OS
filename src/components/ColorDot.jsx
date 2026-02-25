import { cn } from '../lib/utils'

export default function ColorDot({ color, selected, onSelect, rightNote }) {
  return (
    <button
      type="button"
      className={cn(
        'lux-ring group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/20 px-4 py-3 text-left hover:bg-white/35',
        selected && 'border-sky-300/70 bg-white/30',
      )}
      onClick={() => onSelect?.(color)}
    >
      <span
        className={cn(
          'h-9 w-9 rounded-full border border-white/35 shadow-[0_16px_45px_rgba(2,16,36,0.12)]',
          selected && 'shadow-[0_0_0_4px_rgba(124,199,255,0.25)]',
        )}
        style={{ background: color.hex }}
        aria-hidden
      />
      <span className="flex-1 text-sm font-semibold text-slate-900">{color.name}</span>
      {rightNote && <span className="text-xs font-semibold text-slate-700">{rightNote}</span>}
    </button>
  )
}
