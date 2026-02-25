import { NavLink, Link } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import Container from './Container'
import { cn } from '../lib/utils'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
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

          <div className="flex items-center gap-2">
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

            <button
              onClick={() => setMobileOpen(true)}
              className="lux-ring rounded-2xl p-3 hover:bg-white/40 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-slate-800" />
            </button>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 right-0 top-0 w-full max-w-xs border-l border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900 uppercase tracking-widest">Menu</div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 hover:bg-slate-200/50"
                >
                  <X className="h-6 w-6 text-slate-900" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-2">
                {nav.map((i) => (
                  <NavLink
                    key={i.to}
                    to={i.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'rounded-2xl px-5 py-4 text-lg font-medium text-slate-700 transition active:scale-95',
                        isActive ? 'bg-sky-600 text-white shadow-lg' : 'hover:bg-white/60'
                      )
                    }
                  >
                    {i.label}
                  </NavLink>
                ))}
              </nav>

              <div className="absolute bottom-10 left-6 right-6">
                <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">Feliz Studio</div>
                  <div className="mt-2 text-sm text-slate-300">Handmade with joy and premium materials.</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
