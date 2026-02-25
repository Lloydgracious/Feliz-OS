import { NavLink, Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Container from './Container'
import { cn } from '../lib/utils'
import { useCart } from '../context/CartContext'

const nav = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/customize', label: 'Customize' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/support', label: 'Support' },
]

export default function Navbar() {
  const { itemCount, toggleCart } = useCart()

  return (
    <div className="sticky top-0 z-50 border-b border-white/15 bg-white/40 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-[0_16px_45px_rgba(2,68,120,0.25)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-slate-900">Feliz</div>
            <div className="text-xs text-slate-600">Bring ur joy with Feliz</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white/40',
                  isActive && 'bg-white/50 text-slate-900 shadow-sm',
                )
              }
            >
              {i.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={toggleCart}
          className="lux-ring relative rounded-2xl p-3 hover:bg-white/40"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5 text-slate-800" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sky-600 px-1 text-[11px] font-semibold text-white">
              {itemCount}
            </span>
          )}
        </button>
      </Container>
    </div>
  )
}
