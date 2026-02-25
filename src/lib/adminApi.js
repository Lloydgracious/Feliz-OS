import { fsDelete, fsGet, fsList, fsUpsert, fsUpdate } from './firestoreApi'

// Products
export async function adminListProducts() {
  return await fsList('products', { orderByField: 'sort_order', orderDirection: 'asc' })
}
export async function adminUpsertProduct(id, payload) {
  return await fsUpsert('products', id, payload)
}
export async function adminDeleteProduct(id) {
  return await fsDelete('products', id)
}

// Vlogs
export async function adminListVlogVideos() {
  return await fsList('vlog_video_posts', { orderByField: 'sort_order', orderDirection: 'asc' })
}
export async function adminListVlogExps() {
  return await fsList('vlog_experience_posts', { orderByField: 'sort_order', orderDirection: 'asc' })
}
export async function adminListDocs(collectionName) {
  return await fsList(collectionName)
}
export async function adminUpsertDoc(collectionName, id, payload) {
  return await fsUpsert(collectionName, id, payload)
}
export async function adminDeleteDoc(collectionName, id) {
  return await fsDelete(collectionName, id)
}

// Settings
export async function adminListSettings(keys) {
  const out = []
  for (const k of keys) {
    const row = await fsGet('site_settings', k)
    if (row) out.push({ key: k, value: row.value ?? '' })
    else out.push({ key: k, value: '' })
  }
  return out
}
export async function adminUpsertSettings(entries) {
  for (const e of entries) {
    await fsUpsert('site_settings', e.key, { value: e.value ?? '' })
  }
}

// Orders
export async function adminListOrders() {
  return await fsList('orders', { orderByField: 'created_at', orderDirection: 'desc' })
}
export async function adminListOrderItems(orderId) {
  return await fsList('order_items', {
    whereClauses: [['order_id', '==', orderId]],
  })
}
export async function adminUpdateOrderStatus(orderId, nextStatus) {
  return await fsUpdate('orders', orderId, { status: nextStatus })
}
export async function adminDeleteOrder(orderId) {
  // Delete order items first
  const items = await adminListOrderItems(orderId)
  for (const item of items) {
    await fsDelete('order_items', item.id)
  }
  // Delete the order itself
  return await fsDelete('orders', orderId)
}

// Users (profiles collection). Note: cannot list Firebase Auth users from client.
export async function adminListProfiles() {
  return await fsList('profiles', { orderByField: 'created_at', orderDirection: 'desc' })
}
export async function adminSetProfileRole(userId, nextRole) {
  return await fsUpsert('profiles', userId, { role: nextRole })
}
