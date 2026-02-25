export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="lux-glass rounded-2xl px-6 py-5 flex items-center gap-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-sky-300" />
        <div className="text-sm text-slate-700">{label}</div>
      </div>
    </div>
  )
}
