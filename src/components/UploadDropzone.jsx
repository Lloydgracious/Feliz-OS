import { useCallback, useMemo, useRef, useState } from 'react'
import { ImageUp, Trash2, Check } from 'lucide-react'

export default function UploadDropzone({ label = 'Upload Transfer Screenshot', onFile }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const set = useCallback(
    (f) => {
      setFile(f)
      onFile?.(f)
    },
    [onFile],
  )

  function onPick(e) {
    const f = e.target.files?.[0]
    if (f) set(f)
  }

  function onDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) set(f)
  }

  function clear(e) {
    e.preventDefault()
    e.stopPropagation()
    setFile(null)
    onFile?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      <div className="mt-3">
        <label
          className="relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/35 bg-white/20 p-6 transition hover:bg-white/30"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

          {!file ? (
            <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/50">
                <ImageUp className="h-5 w-5 text-slate-800" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">Click to upload screenshot</div>
                <div className="mt-1 text-xs text-slate-600">PNG, JPG — Drag & drop also works</div>
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/25">
                  <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 p-2 text-center text-[10px] font-semibold text-white backdrop-blur-sm">
                    {file.name}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700">
                    <Check className="h-3 w-3" /> Ready
                  </div>
                  <button
                    type="button"
                    onClick={clear}
                    className="lux-ring inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/30 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white/45"
                  >
                    <Trash2 className="h-4 w-4" /> Change
                  </button>
                </div>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  )
}
