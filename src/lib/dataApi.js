import { firebaseReady } from './firebaseClient'
import { fsList } from './firestoreApi'
import { products as fallbackProducts } from '../data/products'
import { experiencePosts as fallbackExperiencePosts, videoPosts as fallbackVideoPosts } from '../data/vlog'

function sortByCreatedAtDesc(a, b) {
  const ad = a.created_at?.toMillis ? a.created_at.toMillis() : a.created_at ? new Date(a.created_at).getTime() : 0
  const bd = b.created_at?.toMillis ? b.created_at.toMillis() : b.created_at ? new Date(b.created_at).getTime() : 0
  return bd - ad
}

export async function fetchProducts() {
  if (!firebaseReady) return fallbackProducts
  return await fsList('products', { orderByField: 'sort_order', orderDirection: 'asc' })
}

export async function fetchProductsForHome(limit = 6) {
  if (!firebaseReady) return fallbackProducts.slice(0, limit)
  return await fsList('products', {
    whereClauses: [['show_on_home', '==', true]],
    orderByField: 'sort_order',
    orderDirection: 'asc',
    limitCount: limit,
  })
}

export async function fetchVlogExperiencePosts() {
  if (!firebaseReady) return fallbackExperiencePosts
  const data = await fsList('vlog_experience_posts', { orderByField: 'created_at', orderDirection: 'desc' })
  return (data ?? []).sort(sortByCreatedAtDesc)
}

export async function fetchVlogVideoPosts() {
  if (!firebaseReady) return fallbackVideoPosts
  const data = await fsList('vlog_video_posts', { orderByField: 'created_at', orderDirection: 'desc' })
  return (data ?? []).sort(sortByCreatedAtDesc)
}
