import { cn } from '../lib/utils'

export default function SectionHeading({ eyebrow, title, subtitle, className }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && (
        <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">{eyebrow.toUpperCase()}</div>
      )}
      <h2 className="mt-2 text-3xl text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-sm text-slate-700">{subtitle}</p>}
    </div>
  )
}
