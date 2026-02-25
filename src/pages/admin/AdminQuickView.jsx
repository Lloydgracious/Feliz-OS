import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import { adminListSettings, adminUpsertSettings } from '../../lib/adminApi'

const QUICK_VIEW_KEYS = [
    { key: 'qv_care_guide', label: 'Care Guide (one per line)' },
    { key: 'qv_delivery_notes', label: 'Delivery Notes (one per line)' },
]

export default function AdminQuickView() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [draftSettings, setDraftSettings] = useState({})

    async function load() {
        setLoading(true)
        try {
            const data = await adminListSettings(QUICK_VIEW_KEYS.map(i => i.key))
            const nextSettings = {}
            for (const i of QUICK_VIEW_KEYS) {
                const v = data.find(r => r.key === i.key)?.value
                nextSettings[i.key] = v || ''
            }
            setDraftSettings(nextSettings)
        } catch {
            toast.error('Failed to load Quick View settings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function save() {
        setSaving(true)
        const t = toast.loading('Saving...')
        try {
            const payload = QUICK_VIEW_KEYS.map(i => ({ key: i.key, value: draftSettings[i.key] || '' }))
            await adminUpsertSettings(payload)
            toast.success('Saved successfully', { id: t })
        } catch {
            toast.error('Save failed', { id: t })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <LoadingSpinner label="Loading settings" />

    return (
        <div className="grid gap-8">
            <div className="lux-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Quick View Content</div>
                        <div className="text-xs text-slate-600">Global instructions for Care and Delivery tabs</div>
                    </div>
                    <Button onClick={save} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <div className="mt-6 grid gap-6">
                    {QUICK_VIEW_KEYS.map(i => (
                        <label key={i.key} className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{i.label}</span>
                            <textarea
                                rows={6}
                                className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-3 text-sm"
                                value={draftSettings[i.key] || ''}
                                onChange={e => setDraftSettings(d => ({ ...d, [i.key]: e.target.value }))}
                                placeholder="Enter each point on a new line"
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="lux-glass rounded-3xl p-6 border-sky-100 bg-sky-50/20">
                <div className="text-sm font-semibold text-sky-900 italic">💡 Pro Tip</div>
                <div className="mt-2 text-xs text-sky-700 leading-relaxed">
                    Write each point on a new line. They will automatically appear as bullet points in the &quot;Care&quot; and &quot;Delivery&quot; tabs when a customer clicks &quot;Quick View&quot; on any product.
                </div>
            </div>
        </div>
    )
}
