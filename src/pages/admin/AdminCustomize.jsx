import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { adminListDocs, adminUpsertDoc, adminDeleteDoc, adminUpsertSettings } from '../../lib/adminApi'
import { formatMMK } from '../../lib/utils'
import { useSettings } from '../../lib/useSettings'

const EMPTY_KNOT = { name: '', meaning: '', description: '', image: '', priceAdd: 0 }
const EMPTY_COLOR = { name: '', hex: '#000000', priceAdd: 0 }

export default function AdminCustomize() {
    const [knots, setKnots] = useState([])
    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)
    const [savingBase, setSavingBase] = useState(false)

    const { data: settings, reload: reloadSettings } = useSettings(['base_customization_price'])
    const [basePriceDraft, setBasePriceDraft] = useState('')

    useEffect(() => {
        if (settings?.base_customization_price) {
            setBasePriceDraft(settings.base_customization_price)
        }
    }, [settings])

    const [knotModal, setKnotModal] = useState(false)
    const [colorModal, setColorModal] = useState(false)
    const [draftKnot, setDraftKnot] = useState(EMPTY_KNOT)
    const [draftColor, setDraftColor] = useState(EMPTY_COLOR)
    const [editId, setEditId] = useState(null)

    async function load() {
        setLoading(true)
        try {
            const k = await adminListDocs('customization_knots')
            const c = await adminListDocs('customization_colors')
            setKnots(k || [])
            setColors(c || [])
        } catch {
            toast.error('Failed to load customization options')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    async function saveKnot() {
        if (!draftKnot.name) return toast.error('Name is required')
        const id = editId || `knot-${Date.now()}`
        try {
            await adminUpsertDoc('customization_knots', id, draftKnot)
            toast.success('Knot saved')
            setKnotModal(false)
            load()
        } catch (e) {
            console.error('Knot Save Error:', e)
            toast.error(`Save failed: ${e.message}. (Check Firestore rules for "customization_knots")`)
        }
    }

    async function deleteKnot(id) {
        if (!confirm('Delete this knot style?')) return
        try {
            await adminDeleteDoc('customization_knots', id)
            toast.success('Deleted')
            load()
        } catch {
            toast.error('Delete failed')
        }
    }

    async function saveColor() {
        if (!draftColor.name) return toast.error('Name is required')
        const id = editId || `color-${Date.now()}`
        try {
            await adminUpsertDoc('customization_colors', id, draftColor)
            toast.success('Color saved')
            setColorModal(false)
            load()
        } catch (e) {
            console.error('Color Save Error:', e)
            toast.error(`Save failed: ${e.message}. (Check Firestore rules for "customization_colors")`)
        }
    }

    async function deleteColor(id) {
        if (!confirm('Delete this color?')) return
        try {
            await adminDeleteDoc('customization_colors', id)
            toast.success('Deleted')
            load()
        } catch {
            toast.error('Delete failed')
        }
    }

    async function syncDefaults() {
        if (!confirm('This will load the default knots and colors into your database. Continue?')) return
        const t = toast.loading('Syncing defaults...')
        try {
            const { knotStyles: defaultKnots, colorOptions: defaultColors } = await import('../../data/customization')
            for (const k of defaultKnots) {
                await adminUpsertDoc('customization_knots', k.id, k)
            }
            for (const c of defaultColors) {
                await adminUpsertDoc('customization_colors', c.id, c)
            }
            toast.success('Defaults loaded successfully', { id: t })
            load()
        } catch (e) {
            console.error('Sync error:', e)
            toast.error('Failed to sync: ' + e.message, { id: t })
        }
    }

    if (loading) return <LoadingSpinner label="Loading customization settings" />

    const hasData = knots.length > 0 || colors.length > 0

    return (
        <div className="grid gap-8">
            {!hasData && (
                <div className="lux-glass rounded-3xl p-6 border-amber-200/50 bg-amber-50/30">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-amber-900">Database is empty</div>
                            <div className="text-xs text-amber-700">Your designer won&apos;t show any options until you add them or sync defaults.</div>
                        </div>
                        <Button variant="secondary" onClick={syncDefaults}>
                            Sync Initial Data
                        </Button>
                    </div>
                </div>
            )}
            {/* Settings Section */}
            <div className="lux-glass rounded-3xl p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">General Settings</div>
                        <div className="text-xs text-slate-600">Base pricing for custom orders</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            className="lux-ring w-32 rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm font-semibold"
                            value={basePriceDraft}
                            onChange={(e) => setBasePriceDraft(e.target.value)}
                        />
                        <Button
                            disabled={savingBase}
                            onClick={async () => {
                                setSavingBase(true)
                                try {
                                    await adminUpsertSettings([{ key: 'base_customization_price', value: basePriceDraft }])
                                    toast.success('Base price updated')
                                    reloadSettings()
                                } catch {
                                    toast.error('Failed to update base price')
                                } finally {
                                    setSavingBase(false)
                                }
                            }}
                        >
                            {savingBase ? 'Saving...' : 'Update Base'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Knots Section */}
            <div className="lux-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Knot Styles</div>
                        <div className="text-xs text-slate-600">Stage 1 & 3 options</div>
                    </div>
                    <Button
                        onClick={() => {
                            setDraftKnot(EMPTY_KNOT)
                            setEditId(null)
                            setKnotModal(true)
                        }}
                    >
                        <Plus className="h-4 w-4" /> Add Knot
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
                    {knots.map((k) => (
                        <div key={k.id} className="lux-ring flex gap-4 rounded-2xl bg-white/40 p-4">
                            <img src={k.image} className="h-16 w-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="truncate font-semibold text-slate-900">{k.name}</div>
                                <div className="text-xs text-slate-600">+{formatMMK(k.priceAdd)}</div>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditId(k.id)
                                            setDraftKnot(k)
                                            setKnotModal(true)
                                        }}
                                        className="text-sky-600 hover:text-sky-700"
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => deleteKnot(k.id)} className="text-rose-600 hover:text-rose-700">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colors Section */}
            <div className="lux-glass rounded-3xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Color Palette</div>
                        <div className="text-xs text-slate-600">Stage 2 & 4 options</div>
                    </div>
                    <Button
                        onClick={() => {
                            setDraftColor(EMPTY_COLOR)
                            setEditId(null)
                            setColorModal(true)
                        }}
                    >
                        <Plus className="h-4 w-4" /> Add Color
                    </Button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {colors.map((c) => (
                        <div key={c.id} className="lux-ring flex items-center gap-3 rounded-2xl bg-white/40 p-3">
                            <div className="h-8 w-8 rounded-full border border-black/5 shadow-sm" style={{ backgroundColor: c.hex }} />
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-900">{c.name}</div>
                                <div className="text-[10px] text-slate-600">{c.hex} • +{formatMMK(c.priceAdd)}</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditId(c.id)
                                        setDraftColor(c)
                                        setColorModal(true)
                                    }}
                                    className="text-sky-600"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => deleteColor(c.id)} className="text-rose-600">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Knot Modal */}
            <Modal open={knotModal} onClose={() => setKnotModal(false)} title={editId ? 'Edit Knot' : 'Add New Knot'}>
                <div className="grid gap-4 py-4">
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Name</span>
                        <input
                            className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftKnot.name}
                            onChange={(e) => setDraftKnot((d) => ({ ...d, name: e.target.value }))}
                        />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Meaning</span>
                            <input
                                className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                                value={draftKnot.meaning}
                                onChange={(e) => setDraftKnot((d) => ({ ...d, meaning: e.target.value }))}
                            />
                        </label>
                        <label className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Price (MMK)</span>
                            <input
                                type="number"
                                className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                                value={draftKnot.priceAdd}
                                onChange={(e) => setDraftKnot((d) => ({ ...d, priceAdd: Number(e.target.value) }))}
                            />
                        </label>
                    </div>
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</span>
                        <textarea
                            className="lux-ring min-h-[80px] rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftKnot.description}
                            onChange={(e) => setDraftKnot((d) => ({ ...d, description: e.target.value }))}
                        />
                    </label>
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Image</span>
                        <input
                            className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftKnot.image}
                            onChange={(e) => setDraftKnot((d) => ({ ...d, image: e.target.value }))}
                            placeholder="Paste URL or upload below"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 text-xs"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const t = toast.loading('Reading...')
                                try {
                                    const { uploadPublicImage } = await import('../../lib/storage')
                                    const b64 = await uploadPublicImage({ file })
                                    setDraftKnot((d) => ({ ...d, image: b64 }))
                                    toast.success('Ready', { id: t })
                                } catch {
                                    toast.error('Failed', { id: t })
                                } finally { e.target.value = '' }
                            }}
                        />
                    </label>
                    <Button onClick={saveKnot} className="mt-2">Save Knot Style</Button>
                </div>
            </Modal>

            {/* Color Modal */}
            <Modal open={colorModal} onClose={() => setColorModal(false)} title={editId ? 'Edit Color' : 'Add New Color'}>
                <div className="grid gap-4 py-4">
                    <label className="grid gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Color Name</span>
                        <input
                            className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                            value={draftColor.name}
                            onChange={(e) => setDraftColor((d) => ({ ...d, name: e.target.value }))}
                        />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hex Code</span>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="h-9 w-12 cursor-pointer rounded-lg border-none bg-transparent"
                                    value={draftColor.hex}
                                    onChange={(e) => setDraftColor((d) => ({ ...d, hex: e.target.value }))}
                                />
                                <input
                                    className="lux-ring flex-1 rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                                    value={draftColor.hex}
                                    onChange={(e) => setDraftColor((d) => ({ ...d, hex: e.target.value }))}
                                />
                            </div>
                        </label>
                        <label className="grid gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Add Price (MMK)</span>
                            <input
                                type="number"
                                className="lux-ring rounded-xl border border-white/20 bg-white/50 px-4 py-2 text-sm"
                                value={draftColor.priceAdd}
                                onChange={(e) => setDraftColor((d) => ({ ...d, priceAdd: Number(e.target.value) }))}
                            />
                        </label>
                    </div>
                    <Button onClick={saveColor} className="mt-2">Save Color Option</Button>
                </div>
            </Modal>
        </div>
    )
}
