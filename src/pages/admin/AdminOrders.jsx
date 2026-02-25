import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/LoadingSpinner'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { adminListOrders, adminListOrderItems, adminUpdateOrderStatus, adminDeleteOrder } from '../../lib/adminApi'
import { formatMMK } from '../../lib/utils'

const STATUSES = ['pending_payment', 'paid', 'shipped', 'completed', 'cancelled']

export default function AdminOrders() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [active, setActive] = useState(null)
  const [items, setItems] = useState([])
  const [saving, setSaving] = useState(false)

  const activeTotal = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items])

  async function load() {
    setLoading(true)
    try {
      const data = await adminListOrders()
      setOrders(data ?? [])
    } catch (e) {
      toast.error(e?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function openOrder(order) {
    setActive(order)
    setItems([])
    try {
      const data = await adminListOrderItems(order.id)
      setItems(data ?? [])
    } catch (e) {
      toast.error(e?.message || 'Failed to load order items')
    }
  }

  async function updateStatus(next) {
    if (!active) return
    setSaving(true)
    const t = toast.loading('Updating…')
    try {
      await adminUpdateOrderStatus(active.id, next)
      toast.success('Updated', { id: t })
      setActive((a) => ({ ...a, status: next }))
      await load()
    } catch (e) {
      toast.error(e?.message || 'Update failed', { id: t })
    } finally {
      setSaving(false)
    }
  }

  async function deleteOrder() {
    if (!active) return
    if (!confirm(`Are you sure you want to delete order ${active.order_code}? This cannot be undone.`)) return

    setSaving(true)
    const t = toast.loading('Deleting order...')
    try {
      await adminDeleteOrder(active.id)
      toast.success('Order deleted', { id: t })
      setActive(null)
      await load()
    } catch (e) {
      toast.error('Delete failed: ' + e.message, { id: t })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading orders" />

  return (
    <div className="lux-glass rounded-3xl p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Orders</div>
          <div className="mt-1 text-sm text-slate-700">Manage payment verification and fulfillment.</div>
        </div>
        <Button onClick={load}>Refresh</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/15">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.9fr_0.8fr] gap-3 bg-white/25 px-4 py-3 text-xs font-semibold tracking-[0.2em] text-sky-700/80">
          <div>ORDER</div>
          <div>STATUS</div>
          <div>CUSTOMER</div>
          <div className="text-right">TOTAL</div>
        </div>
        <div className="divide-y divide-white/10">
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => openOrder(o)}
              className="grid w-full grid-cols-[1.2fr_0.7fr_0.9fr_0.8fr] gap-3 px-4 py-4 text-left text-sm hover:bg-white/15"
            >
              <div>
                <div className="font-semibold text-slate-900">{o.order_code}</div>
                <div className="mt-1 text-xs text-slate-600">{new Date(o.created_at).toLocaleString()}</div>
              </div>
              <div className="text-slate-800">{o.status}</div>
              <div className="text-slate-800">{o.customer_name}</div>
              <div className="text-right font-semibold text-slate-900">{formatMMK(o.total)}</div>
            </button>
          ))}
          {orders.length === 0 && <div className="p-6 text-sm text-slate-700">No orders yet.</div>}
        </div>
      </div>

      <Modal open={!!active} title={active ? `Order ${active.order_code}` : 'Order'} onClose={() => setActive(null)}>
        {active && (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/15 bg-white/15 p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">CUSTOMER</div>
              <div className="mt-2 text-sm text-slate-900">{active.customer_name}</div>
              <div className="mt-1 text-sm text-slate-700">{active.customer_phone}</div>
              <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">{active.customer_address}</div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STATUS</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{active.status}</div>
                </div>
                <select
                  className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                  value={active.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={saving}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {active.proof_url && (
                <div className="mt-4">
                  <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80 mb-2">PAYMENT PROOF</div>
                  <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10">
                    <img
                      src={active.proof_url}
                      alt="Payment proof"
                      className="max-h-60 w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/15 p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">ITEMS</div>
              <div className="mt-3 space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="flex items-start justify-between gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-slate-900">{i.product_name}</div>
                      {i.meta && <div className="mt-1 text-xs text-slate-600">{i.meta}</div>}
                      <div className="mt-1 text-xs text-slate-600">Qty: {i.quantity}</div>
                    </div>
                    <div className="font-semibold text-slate-900">{formatMMK(i.price * i.quantity)}</div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-sm text-slate-700">No items.</div>}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-sm">
                <div className="text-slate-700">Total</div>
                <div className="text-base font-semibold text-slate-900">{formatMMK(activeTotal || active.total)}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={deleteOrder}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Delete Order Permanently
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
