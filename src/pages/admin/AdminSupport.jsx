import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { adminListDocs, adminUpsertDoc, adminDeleteDoc, adminListSettings, adminUpsertSettings } from '../../lib/adminApi'

const SUPPORT_KEYS = [
    { key: 'support_eyebrow', label: 'FAQ Eyebrow' },
    { key: 'support_title', label: 'FAQ Title' },
    { key: 'support_subtitle', label: 'FAQ Subtitle' },
    { key: 'support_contact_eyebrow', label: 'Contact Eyebrow' },
    { key: 'support_contact_title', label: 'Contact Title' },
    { key: 'support_contact_subtitle', label: 'Contact Subtitle' },
    { key: 'support_contact_email', label: 'Contact Email' },
]

export default function AdminSupport() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [faqs, setFaqs] = useState([])
    const [draftSettings, setDraftSettings] = useState({})

    const [faqModal, setFaqModal] = useState(false)
    const [draftFaq, setDraftFaq] = useState({ q: '', a: '' })
    const [editId, setEditId] = useState(null)

    async function load() {
        setLoading(true)
        try {
            const [sData, fData] = await Promise.all([
                adminListSettings(SUPPORT_KEYS.map(i => i.key)),
                adminListDocs('support_faqs')
            ])

            const nextSettings = {}
            for (const i of SUPPORT_KEYS) {
                const v = sData.find(r => r.key === i.key)?.value
                nextSettings[i.key] = typeof v === 'string' ? v : ''
            }
            setDraftSettings(nextSettings)
            setFaqs(fData || [])
        } catch (e) {
            toast.error('Failed to load support settings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function saveSettings() {
        setSaving(true)
        const t = toast.loading('Saving settings...')
        try {
            const payload = SUPPORT_KEYS.map(i => ({ key: i.key, value: draftSettings[i.key] || '' }))
            await adminUpsertSettings(payload)
            toast.success('Settings saved', { id: t })
        } catch (e) {
            toast.error('Save failed', { id: t })
        } finally {
            setSaving(false)
        }
    }

    async function saveFaq() {
        if (!draftFaq.q || !draftFaq.a) return toast.error('Question and Answer are required')
        const id = editId || `faq-${Date.now()}`
        try {
            await adminUpsertDoc('support_faqs', id, draftFaq)
            toast.success('FAQ saved')
            setFaqModal(false)
            load()
        } catch (e) {
            toast.error('Save failed')
        }
    }

    async function deleteFaq(id) {
        if (!confirm('Delete this FAQ?')) return
        try {
            await adminDeleteDoc('support_faqs', id)
            toast.success('Deleted')
            load()
        } catch (e) {
            toast.error('Delete failed')
        }
    }

    if (loading) return <LoadingSpinner label="Loading support settings" />

    return (
        <div className="grid gap-8">
            <div className="lux-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Page Content</div>
                        <div className="text-xs text-slate-600">Headings and contact information</div>
                    </div>
                    <Button onClick={saveSettings} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Page Content'}
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {SUPPORT_KEYS.map(i => (
                        <label key={i.key} className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{i.label}</span>
                            <input
                                className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                                value={draftSettings[i.key] || ''}
                                onChange={e => setDraftSettings(d => ({ ...d, [i.key]: e.target.value }))}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div className="lux-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Frequently Asked Questions</div>
                        <div className="text-xs text-slate-600">List of collapsible FAQ items</div>
                    </div>
                    <Button onClick={() => { setEditId(null); setDraftFaq({ q: '', a: '' }); setFaqModal(true); }}>
                        <Plus className="h-4 w-4" /> Add FAQ
                    </Button>
                </div>

                <div className="mt-6 grid gap-4">
                    {faqs.map(f => (
                        <div key={f.id} className="lux-ring flex items-start justify-between gap-4 rounded-2xl bg-white/40 p-4">
                            <div className="min-w-0">
                                <div className="font-semibold text-slate-900">{f.q}</div>
                                <div className="mt-1 text-xs text-slate-600 line-clamp-2">{f.a}</div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => { setEditId(f.id); setDraftFaq({ q: f.q, a: f.a }); setFaqModal(true); }}
                                    className="text-sky-600"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteFaq(f.id)} className="text-rose-600">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && <div className="text-sm text-slate-600 p-4 italic">No FAQs added yet.</div>}
                </div>
            </div>

            <Modal open={faqModal} onClose={() => setFaqModal(false)} title={editId ? 'Edit FAQ' : 'Add FAQ'}>
                <div className="grid gap-4 py-4">
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Question</span>
                        <input
                            className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftFaq.q}
                            onChange={e => setDraftFaq(d => ({ ...d, q: e.target.value }))}
                        />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Answer</span>
                        <textarea
                            rows={4}
                            className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftFaq.a}
                            onChange={e => setDraftFaq(d => ({ ...d, a: e.target.value }))}
                        />
                    </label>
                    <Button onClick={saveFaq} className="mt-2">Save FAQ</Button>
                </div>
            </Modal>
        </div>
    )
}
