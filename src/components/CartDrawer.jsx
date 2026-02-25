import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cn, formatMMK } from '../lib/utils'

export default function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, setQty, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-40 bg-slate-950/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/20 bg-white/55 backdrop-blur-2xl"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/15 px-5">
              <div className="text-sm font-semibold text-slate-900">Your Cart</div>
              <button onClick={closeCart} className="rounded-xl p-2 hover:bg-white/35" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="flex flex-col gap-4">
                {items.length === 0 ? (
                  <div className="lux-glass rounded-2xl p-6 text-sm text-slate-700">Your cart is empty.</div>
                ) : (
                  items.map((i) => (
                    <div key={i.id} className="lux-glass rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{i.name}</div>
                          {i.meta && <div className="mt-1 text-xs text-slate-600">{i.meta}</div>}
                          <div className="mt-2 text-sm text-slate-800">{formatMMK(i.price)}</div>
                        </div>
                        <button
                          onClick={() => removeItem(i.id)}
                          className="rounded-xl p-2 text-slate-700 hover:bg-white/40"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className={cn('rounded-xl p-2 hover:bg-white/40', i.quantity <= 1 && 'opacity-40')}
                            onClick={() => setQty(i.id, i.quantity - 1)}
                            disabled={i.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            className="lux-ring w-14 rounded-xl border border-white/25 bg-white/40 px-3 py-2 text-center text-sm"
                            value={i.quantity}
                            onChange={(e) => setQty(i.id, e.target.value)}
                            inputMode="numeric"
                          />
                          <button
                            className="rounded-xl p-2 hover:bg-white/40"
                            onClick={() => setQty(i.id, i.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{formatMMK(i.price * i.quantity)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/15 px-5 py-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-700">Total</div>
                <div className="text-base font-semibold text-slate-900">{formatMMK(subtotal)}</div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white hover:brightness-105"
                >
                  Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full rounded-2xl border border-white/25 bg-white/35 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white/45"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
