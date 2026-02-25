import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import { adminListSettings, adminUpsertSettings } from '../../lib/adminApi'

const HOME_KEYS = [
  { key: 'home_hero_badge', label: 'Hero badge' },
  { key: 'home_hero_title', label: 'Hero title' },
  { key: 'home_hero_subtitle', label: 'Hero subtitle' },
  { key: 'home_hero_image', label: 'Hero image 1 URL' },
  { key: 'home_hero_image_2', label: 'Hero image 2 URL' },
  { key: 'home_hero_image_3', label: 'Hero image 3 URL' },
  { key: 'home_hero_image_4', label: 'Hero image 4 URL' },
  { key: 'home_collection_eyebrow', label: 'Collection eyebrow' },
  { key: 'home_collection_title', label: 'Collection title' },
  { key: 'home_collection_subtitle', label: 'Collection subtitle' },
  { key: 'home_heritage_eyebrow', label: 'Heritage eyebrow' },
  { key: 'home_heritage_title', label: 'Heritage title' },
  { key: 'home_heritage_subtitle', label: 'Heritage subtitle' },
  { key: 'home_custom_eyebrow', label: 'Customization eyebrow' },
  { key: 'home_custom_title', label: 'Customization title' },
  { key: 'home_custom_subtitle', label: 'Customization subtitle' },
]

export default function AdminHome() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState([])

  const map = useMemo(() => {
    const m = new Map()
    for (const r of rows) m.set(r.key, r.value)
    return m
  }, [rows])

  const [draft, setDraft] = useState(() => {
    const init = {}
    for (const i of HOME_KEYS) init[i.key] = ''
    return init
  })

  async function load() {
    setLoading(true)
    try {
      const data = await adminListSettings(HOME_KEYS.map((i) => i.key))
      setRows(data ?? [])

      const next = { ...draft }
      for (const i of HOME_KEYS) {
        const v = (data ?? []).find((r) => r.key === i.key)?.value
        next[i.key] = typeof v === 'string' ? v : v?.text ?? ''
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
      const payload = HOME_KEYS.map((i) => ({ key: i.key, value: draft[i.key] ?? '' }))
      await adminUpsertSettings(payload)
      toast.success('Saved', { id: t })
      await load()
    } catch (e) {
      toast.error(e?.message || 'Save failed', { id: t })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading home settings" />

  return (
    <div className="lux-glass rounded-3xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Home page</div>
          <div className="mt-1 text-sm text-slate-700">Edit key homepage texts without touching code.</div>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="mt-6 grid gap-6">
        {HOME_KEYS.map((i) => {
          const isImage = i.key.includes('image')
          return (
            <div key={i.key} className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">{i.label}</span>
              <div className="grid gap-3">
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draft[i.key] ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [i.key]: e.target.value }))}
                  placeholder={map.get(i.key) ?? ''}
                />
                {isImage && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs text-slate-600"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const t = toast.loading('Reading image…')
                        try {
                          const { uploadPublicImage } = await import('../../lib/storage')
                          const b64 = await uploadPublicImage({ file })
                          setDraft((d) => ({ ...d, [i.key]: b64 }))
                          toast.success('Ready', { id: t })
                        } catch (err) {
                          toast.error('Failed to read image', { id: t })
                        } finally {
                          e.target.value = ''
                        }
                      }}
                    />
                    <div className="text-[10px] text-slate-500">
                      Images are stored in the database. Use small files (under 1MB).
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
