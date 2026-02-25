import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-white/20 px-4 py-3">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <div className="truncate text-sm font-semibold text-slate-900">{value}</div>
        <button
          type="button"
          onClick={copy}
          className="lux-ring inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/30 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white/45"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
