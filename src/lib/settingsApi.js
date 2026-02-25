import { firebaseReady } from './firebaseClient'
import { fsGet } from './firestoreApi'

export async function fetchSettings(keys) {
  if (!firebaseReady) return {}
  const out = {}
  for (const k of keys) {
    const doc = await fsGet('site_settings', k)
    if (doc && typeof doc.value === 'string') out[k] = doc.value
  }
  return out
}
