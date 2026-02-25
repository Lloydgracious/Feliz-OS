import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth'
import { auth, firebaseReady } from '../lib/firebaseClient'

const AuthContext = createContext(null)

function parseIsAdminFromClaims(idTokenResult) {
  const claims = idTokenResult?.claims ?? {}
  return !!claims.admin
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adminLoading, setAdminLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminError, setAdminError] = useState(null)

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setUser(null)
      setLoading(false)
      setIsAdmin(false)
      setAdminLoading(false)
      setAdminError('Firebase not configured')
      return
    }

    setLoading(true)
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)

      if (!u) {
        setIsAdmin(false)
        setAdminError(null)
        setAdminLoading(false)
        return
      }

      setAdminLoading(true)
      setAdminError(null)
      try {
        // Custom claim approach: set admin=true on the Firebase Auth user.
        const tokenResult = await u.getIdTokenResult(true)
        setIsAdmin(parseIsAdminFromClaims(tokenResult))
      } catch (e) {
        setIsAdmin(false)
        setAdminError(e?.message || 'Failed to check admin claim')
      } finally {
        setAdminLoading(false)
      }
    })

    return () => unsub()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      adminLoading,
      isAdmin,
      adminError,
      firebaseReady,
      signInWithPassword: async ({ email, password }) => {
        if (!firebaseReady || !auth) throw new Error('Firebase not configured')
        return await signInWithEmailAndPassword(auth, email, password)
      },
      signInWithGoogle: async () => {
        if (!firebaseReady || !auth) throw new Error('Firebase not configured')
        const provider = new GoogleAuthProvider()
        return await signInWithPopup(auth, provider)
      },
      signOut: async () => {
        if (!firebaseReady || !auth) return
        await fbSignOut(auth)
      },
    }),
    [user, loading, adminLoading, isAdmin, adminError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
