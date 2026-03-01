import { motion } from 'framer-motion'
import { Eye, Plus } from 'lucide-react'
import { cn, formatMMK } from '../lib/utils'

export default function ProductCard({ product, onQuickView, onAdd, className }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn('lux-glass group rounded-3xl p-4', className)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent" />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm text-slate-600">{product.category ?? product.type}</div>
            <div className="text-base font-semibold text-slate-900">{product.name}</div>
          </div>
          <div className="text-sm font-semibold text-slate-900">{formatMMK(product.price)}</div>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-slate-700">{product.description}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onQuickView?.(product)}
            className="lux-ring inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/35 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white/45"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
          <button
            onClick={() => onAdd?.(product)}
            className="lux-ring inline-flex items-center justify-center rounded-2xl bg-feliz-blue px-4 py-3 text-sm font-semibold text-white hover:brightness-105"
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
