import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Container from '../../components/Container'
import PageTransition from '../../components/PageTransition'
import SectionHeading from '../../components/SectionHeading'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { signInWithPassword, signInWithGoogle, firebaseReady } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const nav = useNavigate()
  const loc = useLocation()

  const from = useMemo(() => loc.state?.from || '/admin', [loc.state])

  return (
    <PageTransition>
      <Container className="py-14">
        <SectionHeading eyebrow="Admin" title="Sign in" subtitle="Use your Firebase admin account." />

        <div className="mt-10 max-w-xl lux-glass rounded-[36px] p-8">
          {!firebaseReady && (
            <div className="rounded-3xl border border-white/15 bg-white/15 p-5 text-sm text-slate-700">
              Firebase is not configured. Set VITE_FIREBASE_* variables in .env.local.
            </div>
          )}

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">EMAIL</span>
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">PASSWORD</span>
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </label>

            {error && <div className="text-sm text-red-700">{error}</div>}

            <button
              type="button"
              disabled={!firebaseReady || loading || !email || !password}
              className={`rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                !firebaseReady || loading || !email || !password
                  ? 'border border-white/15 bg-white/15 text-slate-500'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-105'
              }`}
              onClick={async () => {
                setLoading(true)
                setError(null)
                try {
                  await signInWithPassword({ email, password })
                  nav(from, { replace: true })
                } catch (e) {
                  setError(e?.message || 'Sign in failed')
                } finally {
                  setLoading(false)
                }
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <button
              type="button"
              disabled={!firebaseReady || loading}
              className={`rounded-2xl border px-5 py-4 text-sm font-semibold transition ${
                !firebaseReady || loading
                  ? 'border-white/15 bg-white/15 text-slate-500'
                  : 'border-white/25 bg-white/40 text-slate-800 hover:bg-white/55'
              }`}
              onClick={async () => {
                setLoading(true)
                setError(null)
                try {
                  await signInWithGoogle()
                  nav(from, { replace: true })
                } catch (e) {
                  setError(e?.message || 'Google sign-in failed')
                } finally {
                  setLoading(false)
                }
              }}
            >
              Continue with Google
            </button>
          </div>
        </div>
      </Container>
    </PageTransition>
  )
}
