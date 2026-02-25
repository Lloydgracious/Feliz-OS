import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import { adminListSettings, adminUpsertSettings } from '../../lib/adminApi'

const SHOP_KEYS = [
  { key: 'shop_eyebrow', label: 'Shop eyebrow' },
  { key: 'shop_title', label: 'Shop title' },
  { key: 'shop_subtitle', label: 'Shop subtitle' },
  { key: 'shop_banner', label: 'Shop banner text (optional)' },
]

export default function AdminShop() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState([])

  const map = useMemo(() => {
    const m = new Map()
    for (const r of rows) m.set(r.key, r.value)
    return m
  }, [rows])

  const [draft, setDraft] = useState(() => Object.fromEntries(SHOP_KEYS.map((i) => [i.key, ''])))

  async function load() {
    setLoading(true)
    try {
      const data = await adminListSettings(SHOP_KEYS.map((i) => i.key))
      setRows(data ?? [])

      const next = { ...draft }
      for (const i of SHOP_KEYS) {
        next[i.key] = (data ?? []).find((r) => r.key === i.key)?.value ?? ''
      }
      setDraft(next)
    } catch (e) {
      toast.error(e?.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save() {
    setSaving(true)
    const t = toast.loading('Saving…')
    try {
      const payload = SHOP_KEYS.map((i) => ({ key: i.key, value: draft[i.key] ?? '' }))
      await adminUpsertSettings(payload)
      toast.success('Saved', { id: t })
      await load()
    } catch (e) {
      toast.error(e?.message || 'Save failed', { id: t })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading shop settings" />

  return (
    <div className="lux-glass rounded-3xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Shop page</div>
          <div className="mt-1 text-sm text-slate-700">Edit shop page text and banner.</div>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {SHOP_KEYS.map((i) => (
          <label key={i.key} className="grid gap-2">
            <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">{i.label}</span>
            <input
              className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
              value={draft[i.key] ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, [i.key]: e.target.value }))}
              placeholder={map.get(i.key) ?? ''}
            />
          </label>
        ))}
      </div>
    </div>
  )
}
