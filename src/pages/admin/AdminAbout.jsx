import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import { adminListSettings, adminUpsertSettings } from '../../lib/adminApi'

const ABOUT_KEYS = [
    { key: 'about_eyebrow', label: 'Eyebrow' },
    { key: 'about_title', label: 'Title' },
    { key: 'about_subtitle', label: 'Subtitle' },
    { key: 'about_story_title', label: 'Story Title' },
    { key: 'about_story_p1', label: 'Story Paragraph 1', type: 'textarea' },
    { key: 'about_story_p2', label: 'Story Paragraph 2', type: 'textarea' },
    { key: 'about_info1_k', label: 'Info Box 1 Label' },
    { key: 'about_info1_v', label: 'Info Box 1 Value' },
    { key: 'about_info2_k', label: 'Info Box 2 Label' },
    { key: 'about_info2_v', label: 'Info Box 2 Value' },
    { key: 'about_info3_k', label: 'Info Box 3 Label' },
    { key: 'about_info3_v', label: 'Info Box 3 Value' },
    { key: 'about_info4_k', label: 'Info Box 4 Label' },
    { key: 'about_info4_v', label: 'Info Box 4 Value' },
    { key: 'about_gallery_1', label: 'Gallery Image 1 URL' },
    { key: 'about_gallery_2', label: 'Gallery Image 2 URL' },
    { key: 'about_gallery_3', label: 'Gallery Image 3 URL' },
    { key: 'about_gallery_4', label: 'Gallery Image 4 URL' },
]

export default function AdminAbout() {
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
        for (const i of ABOUT_KEYS) init[i.key] = ''
        return init
    })

    async function load() {
        setLoading(true)
        try {
            const data = await adminListSettings(ABOUT_KEYS.map((i) => i.key))
            setRows(data ?? [])

            const next = { ...draft }
            for (const i of ABOUT_KEYS) {
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
            const payload = ABOUT_KEYS.map((i) => ({ key: i.key, value: draft[i.key] ?? '' }))
            await adminUpsertSettings(payload)
            toast.success('Saved', { id: t })
            await load()
        } catch (e) {
            toast.error(e?.message || 'Save failed', { id: t })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <LoadingSpinner label="Loading about settings" />

    return (
        <div className="lux-glass rounded-3xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-sm font-semibold text-slate-900">About page</div>
                    <div className="mt-1 text-sm text-slate-700">Edit your brand story and about page text.</div>
                </div>
                <Button onClick={save} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                </Button>
            </div>

            <div className="mt-6 grid gap-6">
                {ABOUT_KEYS.map((i) => {
                    const isImage = i.key.includes('gallery') || i.key.includes('image')
                    return (
                        <div key={i.key} className="grid gap-2">
                            <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">{i.label}</span>
                            <div className="grid gap-3">
                                {i.type === 'textarea' ? (
                                    <textarea
                                        className="lux-ring min-h-[100px] rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                                        value={draft[i.key] ?? ''}
                                        onChange={(e) => setDraft((d) => ({ ...d, [i.key]: e.target.value }))}
                                        placeholder={map.get(i.key) ?? ''}
                                    />
                                ) : (
                                    <input
                                        className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                                        value={draft[i.key] ?? ''}
                                        onChange={(e) => setDraft((d) => ({ ...d, [i.key]: e.target.value }))}
                                        placeholder={map.get(i.key) ?? ''}
                                    />
                                )}
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
