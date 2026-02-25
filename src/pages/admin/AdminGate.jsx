import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import Container from '../../components/Container'
import { useAuth } from '../../context/AuthContext'

export default function AdminGate() {
  const { user, loading, firebaseReady, isAdmin, adminLoading, adminError } = useAuth()
  const loc = useLocation()

  if (!firebaseReady) {
    return (
      <div className="py-14">
        <Container className="lux-glass rounded-3xl p-10">
          <div className="text-sm font-semibold text-slate-900">Firebase not configured</div>
          <div className="mt-2 text-sm text-slate-700">
            Set the <span className="font-semibold">VITE_FIREBASE_*</span> environment variables in <span className="font-semibold">.env.local</span>
            to use the admin panel.
          </div>
        </Container>
      </div>
    )
  }

  if (loading || adminLoading) {
    return (
      <div className="py-14">
        <Container className="lux-glass rounded-3xl p-10">
          <LoadingSpinner label="Loading session" />
        </Container>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
  }

  if (!isAdmin) {
    return (
      <div className="py-14">
        <Container className="lux-glass rounded-3xl p-10">
          <div className="text-sm font-semibold text-slate-900">Access Denied</div>
          <div className="mt-2 text-sm text-slate-700">
            Account <span className="font-semibold">{user.email}</span> is authenticated, but does not have admin privileges.
          </div>

          {adminError && (
            <div className="mt-4 rounded-3xl border border-white/15 bg-white/15 p-5 text-sm text-slate-700">
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">ERROR DETAILS</div>
              <div className="mt-2 font-mono text-xs text-slate-700">{adminError}</div>
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-white/15 bg-white/15 p-5 text-sm text-slate-700">
            <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">HOW TO FIX</div>
            <div className="mt-3 space-y-3 text-sm">
              <p>
                To grant admin access, you must set a custom claim for this user.
                Since this is a client-side app, ensure your Firebase Auth user has the
                <code className="bg-slate-950/20 px-1 rounded">admin: true</code> claim.
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs italic">
                Tip: You can verify your data in the Firestore &quot;site_settings&quot; and &quot;products&quot; collections.
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return <Outlet />
}
