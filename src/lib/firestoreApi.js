import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, firebaseReady } from './firebaseClient'

function requireDb() {
  if (!firebaseReady || !db) throw new Error('Firebase not configured')
  return db
}

export async function fsList(collectionName, { orderByField, orderDirection = 'asc', whereClauses = [], limitCount } = {}) {
  const database = requireDb()
  const col = collection(database, collectionName)
  const parts = []
  for (const [field, op, value] of whereClauses) parts.push(where(field, op, value))
  if (orderByField) parts.push(orderBy(orderByField, orderDirection))
  if (limitCount) parts.push(limit(limitCount))
  const q = parts.length ? query(col, ...parts) : query(col)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function fsGet(collectionName, id) {
  const database = requireDb()
  const ref = doc(database, collectionName, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function fsUpsert(collectionName, id, data) {
  const database = requireDb()
  const ref = doc(database, collectionName, id)
  await setDoc(ref, { ...data, updated_at: serverTimestamp() }, { merge: true })
  return id
}

export async function fsCreate(collectionName, id, data) {
  const database = requireDb()
  const ref = doc(database, collectionName, id)
  await setDoc(ref, { ...data, created_at: serverTimestamp(), updated_at: serverTimestamp() }, { merge: false })
  return id
}

export async function fsUpdate(collectionName, id, data) {
  const database = requireDb()
  const ref = doc(database, collectionName, id)
  await updateDoc(ref, { ...data, updated_at: serverTimestamp() })
  return id
}

export async function fsDelete(collectionName, id) {
  const database = requireDb()
  const ref = doc(database, collectionName, id)
  await deleteDoc(ref)
}
