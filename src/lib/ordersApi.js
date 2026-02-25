import { firebaseReady } from './firebaseClient'
import { fsCreate } from './firestoreApi'
import { uploadPublicImage } from './storage'

export function makeOrderCode() {
  return `FZ-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
}

export async function createOrder({ customer, items, proofFile }) {
  if (!firebaseReady) throw new Error('Firebase not configured')
  if (!items?.length) throw new Error('Cart is empty')
  if (!customer?.name || !customer?.phone || !customer?.address) throw new Error('Missing customer details')

  const orderId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
  const orderCode = makeOrderCode()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  let proofUrl = null
  if (proofFile) {
    proofUrl = await uploadPublicImage({ bucket: 'order-proofs', file: proofFile, pathPrefix: orderId })
  }

  await fsCreate('orders', orderId, {
    order_code: orderCode,
    status: 'pending_payment',
    customer_name: customer.name,
    customer_phone: customer.phone,
    customer_address: customer.address,
    total,
    proof_url: proofUrl,
  })

  for (const i of items) {
    await fsCreate('order_items', (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).slice(2), {
      order_id: orderId,
      product_id: i.id,
      product_name: i.name,
      price: i.price,
      quantity: i.quantity,
      meta: i.meta ?? null,
    })
  }

  return { id: orderId, orderCode, proofUrl, total }
}
