import { NavLink, Outlet, ScrollRestoration } from 'react-router-dom'
import Container from '../../components/Container'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/home', label: 'Home Page' },
  { to: '/admin/about', label: 'About Page' },
  { to: '/admin/customize', label: 'Customize Page' },
  { to: '/admin/support', label: 'Support Page' },
  { to: '/admin/checkout', label: 'Checkout Info' },
  { to: '/admin/shop', label: 'Shop Page' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/vlogs', label: 'Vlogs' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 lux-pattern opacity-50" />
      <ScrollRestoration />

      <div className="relative py-10">
        <Container>
          <div className="lux-glass rounded-[36px] p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">ADMIN</div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">Feliz Admin Panel</div>
                <div className="mt-1 text-xs text-slate-600">Signed in as: {user?.email}</div>
              </div>

              <button
                className="rounded-2xl border border-white/20 bg-white/25 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white/40"
                type="button"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {nav.map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  end={i.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white/35',
                      isActive && 'bg-white/50 text-slate-900 shadow-sm',
                    )
                  }
                >
                  {i.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Outlet />
          </div>
        </Container>
      </div>
    </div>
  )
}
