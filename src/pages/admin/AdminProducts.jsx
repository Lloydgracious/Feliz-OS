import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { adminDeleteProduct, adminListProducts, adminUpsertProduct } from '../../lib/adminApi'
import LoadingSpinner from '../../components/LoadingSpinner'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { uploadPublicImage } from '../../lib/storage'

function emptyProduct() {
  return {
    id: '',
    type: 'Bracelet',
    category: 'Knots',
    name: '',
    colors: [],
    price: 0,
    image: '',
    description: '',
    quick_view_details: '',
    show_on_home: false,
    hide_care_delivery: false,
    sort_order: 100,
  }
}

function parseColors(value) {
  return value
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState(emptyProduct())
  const [colorsText, setColorsText] = useState('')

  const isEdit = useMemo(() => !!draft?.id, [draft])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminListProducts()
      setItems(data ?? [])
    } catch (e) {
      setError(e?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    const p = emptyProduct()
    setDraft(p)
    setColorsText('')
    setOpen(true)
  }

  function openEdit(p) {
    setDraft({ ...p })
    setColorsText((p.colors ?? []).join(', '))
    setOpen(true)
  }

  async function remove(id) {
    const ok = confirm('Delete this product?')
    if (!ok) return

    const prev = items
    setItems((x) => x.filter((p) => p.id !== id))
    const t = toast.loading('Deleting…')
    try {
      await adminDeleteProduct(id)
      toast.success('Deleted', { id: t })
    } catch (e) {
      setItems(prev)
      toast.error(e?.message || 'Delete failed', { id: t })
    }
  }

  async function save() {
    const payload = {
      type: draft.type || null,
      category: draft.category || null,
      name: draft.name?.trim(),
      colors: parseColors(colorsText),
      price: Number(draft.price) || 0,
      image: draft.image || null,
      description: draft.description || null,
      quick_view_details: draft.quick_view_details || null,
      show_on_home: !!draft.show_on_home,
      hide_care_delivery: !!draft.hide_care_delivery,
      sort_order: Number(draft.sort_order) || 0,
    }

    if (!payload.name) {
      toast.error('Name is required')
      return
    }

    setSaving(true)
    const t = toast.loading(isEdit ? 'Saving…' : 'Creating…')
    try {
      if (isEdit) {
        await adminUpsertProduct(draft.id, payload)
      } else {
        const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2)
        await adminUpsertProduct(id, { id, ...payload })
      }

      toast.success(isEdit ? 'Saved' : 'Created', { id: t })
      setOpen(false)
      await load()
    } catch (e) {
      toast.error(e?.message || 'Save failed', { id: t })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading products" />

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Products</div>
          <div className="mt-1 text-sm text-slate-700">
            Manage your shop products. Use “Show on home page” to control the home grid.
          </div>
        </div>
        <Button onClick={openCreate}>New product</Button>
      </div>

      {error && <div className="mt-6 text-sm text-red-700">{error}</div>}

      <div className="mt-6 grid gap-4">
        {items.map((p) => (
          <div key={p.id} className="lux-glass rounded-3xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-semibold text-slate-900">{p.name}</div>
                  {p.show_on_home && (
                    <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-700">
                      Home
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  {p.category ?? p.type} • {Number(p.price).toLocaleString()} MMK
                </div>
                <div className="mt-2 text-xs text-slate-600 line-clamp-2">{p.description}</div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => openEdit(p)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => remove(p.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && <div className="text-sm text-slate-600">No products yet.</div>}
      </div>

      <Modal open={open} title={isEdit ? 'Edit product' : 'New product'} onClose={() => !saving && setOpen(false)}>
        <div className="flex max-h-[70vh] flex-col gap-4">
          <div className="grid flex-1 gap-4 overflow-y-auto pr-1">
            <div className="grid gap-2">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">NAME</div>
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">CATEGORY</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">TYPE</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draft.type}
                  onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">PRICE (MMK)</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draft.price}
                  type="number"
                  onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                />
              </label>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">COLORS (comma separated)</div>
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={colorsText}
                onChange={(e) => setColorsText(e.target.value)}
                placeholder="ice blue, white, silver"
              />
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">IMAGE</div>
              <div className="grid gap-3">
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={draft.image}
                  onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
                  placeholder="Paste image URL or upload below"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const t = toast.loading('Reading image…')
                    try {
                      const url = await uploadPublicImage({ file })
                      setDraft((d) => ({ ...d, image: url }))
                      toast.success('Ready (storing in database)', { id: t })
                    } catch (err) {
                      toast.error(err?.message || 'Failed to read image', { id: t })
                    } finally {
                      e.target.value = ''
                    }
                  }}
                />
                <div className="text-xs text-slate-600">
                  Photos are stored directly in the database to avoid paid storage plans.
                  <span className="font-semibold text-amber-700"> Documents must stay under 1MB.</span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">DESCRIPTION</div>
              <textarea
                className="lux-ring min-h-28 rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">QUICK VIEW DETAILS (one per line)</div>
              <textarea
                className="lux-ring min-h-28 rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={draft.quick_view_details}
                onChange={(e) => setDraft((d) => ({ ...d, quick_view_details: e.target.value }))}
                placeholder="Adjustable sizing · 100% Cotton · Gift boxed"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/15 px-4 py-3">
              <input
                type="checkbox"
                checked={!!draft.show_on_home}
                onChange={(e) => setDraft((d) => ({ ...d, show_on_home: e.target.checked }))}
              />
              <span className="text-sm font-semibold text-slate-800">Show on home page</span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/15 px-4 py-3">
              <input
                type="checkbox"
                checked={!!draft.hide_care_delivery}
                onChange={(e) => setDraft((d) => ({ ...d, hide_care_delivery: e.target.checked }))}
              />
              <span className="text-sm font-semibold text-slate-800">Hide Care/Delivery tabs</span>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">SORT ORDER</span>
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={draft.sort_order}
                type="number"
                onChange={(e) => setDraft((d) => ({ ...d, sort_order: e.target.value }))}
              />
            </label>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
