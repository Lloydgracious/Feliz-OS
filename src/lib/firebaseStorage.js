import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage, firebaseReady } from './firebaseClient'

function safeUid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function uploadPublicFile({ path, file }) {
  if (!firebaseReady || !storage) throw new Error('Firebase not configured')
  if (!file) throw new Error('No file selected')

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    // Remove leading/trailing slashes from path to avoid issues with some Firebase versions
    const cleanPath = path.replace(/^\/+|\/+$/g, '')
    const fullPath = `${cleanPath}/${safeUid()}-${safeName}`

    const r = ref(storage, fullPath)
    await uploadBytes(r, file)
    return await getDownloadURL(r)
  } catch (err) {
    console.error('Firebase Upload Error:', err)
    throw new Error(err?.message || 'Failed to upload file to storage')
  }
}
