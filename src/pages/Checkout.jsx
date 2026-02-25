import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import CopyField from '../components/CopyField'
import UploadDropzone from '../components/UploadDropzone'
import { useCart } from '../context/CartContext'

import { formatMMK } from '../lib/utils'

import { STORAGE_KEY } from './Receipt'
import { createOrder } from '../lib/ordersApi'
import toast from 'react-hot-toast'

import { useSettings } from '../lib/useSettings'

export default function Checkout() {
  const { data: settings } = useSettings([
    'checkout_bank_name',
    'checkout_account_name',
    'checkout_account_number',
    'checkout_note',
  ])

  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [proof, setProof] = useState(null)
  const [proofDataUrl, setProofDataUrl] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  })

  const canPlace = useMemo(() => {
    return items.length > 0 && form.name && form.phone && form.address && !!proof
  }, [items.length, form, proof])

  return (
    <PageTransition>
      <Container className="py-14">
        <SectionHeading
          eyebrow="Checkout"
          title="Complete your order"
          subtitle="Fill delivery details, review your order, then confirm via bank transfer. Customized orders typically take ~2 weeks."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="lux-glass rounded-[36px] p-6 sm:p-8">
            <div className="text-sm font-semibold text-slate-900">Delivery details</div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">FULL NAME</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">PHONE</span>
                <input
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 555 123 456"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">DELIVERY ADDRESS</span>
                <textarea
                  rows={4}
                  className="lux-ring resize-none rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Street, city, region, postal code"
                />
              </label>
            </div>

            <div className="mt-10 border-t border-white/15 pt-8">
              <div className="text-sm font-semibold text-slate-900">Bank transfer</div>
              <p className="mt-2 text-sm text-slate-700">
                Transfer to the account below, then upload a screenshot.
              </p>

              <div className="mt-5 grid gap-3">
                <CopyField label="Bank Name" value={settings?.checkout_bank_name || 'Feliz Bank — Premium Branch'} />
                <CopyField label="Account Name" value={settings?.checkout_account_name || 'Feliz Handmade Studio'} />
                <CopyField label="Account Number" value={settings?.checkout_account_number || '123-456-7890'} />
              </div>

              <div className="mt-6">
                <UploadDropzone
                  onFile={(file) => {
                    setProof(file)
                    if (!file) {
                      setProofDataUrl(null)
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => setProofDataUrl(String(reader.result))
                    reader.readAsDataURL(file)
                  }}
                />
              </div>
            </div>
          </div>

          <aside className="lux-glass rounded-[36px] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">Order summary</div>
                <div className="mt-1 text-sm text-slate-700">{items.length} item(s)</div>
              </div>
              <Link
                to="/shop"
                className="rounded-2xl border border-white/20 bg-white/25 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-white/40"
              >
                Add more
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-3xl border border-white/15 bg-white/15 p-6 text-sm text-slate-700">
                  Your cart is empty.
                </div>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="rounded-3xl border border-white/15 bg-white/15 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{i.name}</div>
                        {i.meta && <div className="mt-1 text-xs text-slate-600">{i.meta}</div>}
                        <div className="mt-2 text-xs text-slate-600">Qty: {i.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{formatMMK(i.price * i.quantity)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <div className="flex items-center justify-between text-sm">
                <div className="text-slate-700">Total</div>
                <div className="text-base font-semibold text-slate-900">{formatMMK(subtotal)}</div>
              </div>

              <button
                type="button"
                disabled={!canPlace || placing}
                onClick={async () => {
                  setPlacing(true)
                  const t = toast.loading('Placing order…')
                  try {
                    // Create order in Supabase (admin will verify payment)
                    await createOrder({ customer: form, items, proofFile: proof })

                    // Still store a local receipt so the Receipt page can show immediately
                    const receipt = {
                      id: `FZ-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                      createdAt: new Date().toISOString(),
                      customer: { ...form },
                      items: items.map((i) => ({
                        id: i.id,
                        name: i.name,
                        price: i.price,
                        quantity: i.quantity,
                        meta: i.meta,
                      })),
                      proofDataUrl,
                    }

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(receipt))

                    clear()
                    setProof(null)
                    setProofDataUrl(null)
                    setForm({ name: '', phone: '', address: '' })

                    toast.success('Order placed', { id: t })
                    navigate('/receipt')
                  } catch (e) {
                    console.error('Order Error:', e)
                    toast.error(e?.message || 'Failed to place order', { id: t })
                  } finally {
                    setPlacing(false)
                  }
                }}
                className={`mt-5 w-full rounded-2xl px-5 py-4 text-sm font-semibold transition ${canPlace && !placing
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-105'
                  : 'border border-white/15 bg-white/15 text-slate-500'
                  }`}
              >
                {placing ? 'Placing…' : 'Place order'}
              </button>

              {!canPlace && items.length > 0 && (
                <div className="mt-4 rounded-xl bg-amber-500/10 p-3 text-center text-[11px] font-medium text-amber-800">
                  {!form.name || !form.phone || !form.address
                    ? 'Please fill delivery details'
                    : !proof
                      ? 'Please upload payment transfer screenshot'
                      : 'Please check all fields'}
                </div>
              )}

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div>Customized product orders typically take <span className="font-semibold text-slate-800">~2 weeks</span> to prepare.</div>
                <div>We’ll send your order confirmation after payment is verified.</div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </PageTransition>
  )
}
