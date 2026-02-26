import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { formatMMK } from '../lib/utils'
import Button from './Button'
import Tabs from './Tabs'
import { careGuide as defaultCare, deliveryNotes as defaultDelivery } from '../data/knotInfo'
import { useSettings } from '../lib/useSettings'

export default function QuickViewContent({ product, onAdd }) {
  const [tab, setTab] = useState('details')
  const { data: settings } = useSettings(['qv_care_guide', 'qv_delivery_notes'])

  const careGuide = useMemo(() => {
    if (!settings?.qv_care_guide) return defaultCare
    return settings.qv_care_guide.split('\n').map(s => s.trim()).filter(Boolean)
  }, [settings])

  const deliveryNotes = useMemo(() => {
    if (!settings?.qv_delivery_notes) return defaultDelivery
    return settings.qv_delivery_notes.split('\n').map(s => s.trim()).filter(Boolean)
  }, [settings])

  const bullets = useMemo(() => {
    if (!product) return []
    if (product.quick_view_details) {
      return product.quick_view_details.split('\n').map(s => s.trim()).filter(Boolean)
    }

    const base = [
      `Category: ${product.category ?? product.type}`,
      `Colors: ${(product.colors ?? []).join(' · ') || '—'}`,
    ]
    if (product.type === 'Bracelet') {
      base.push('Sizing: Adjustable fit (approx. 14–19cm wrist)')
    }
    if (product.type === 'Keychain') {
      base.push('Size: Compact daily carry (approx. 9–12cm length)')
    }
    base.push('Finish: Hand-tensioned knotwork, inspected before dispatch')
    return base
  }, [product])

  const tabs = useMemo(() => {
    const base = [{ id: 'details', label: 'Details' }]
    if (!product?.hide_care_delivery) {
      base.push({ id: 'care', label: 'Care' })
    }
    return base
  }, [product?.hide_care_delivery])

  // Ensure current tab is valid
  useEffect(() => {
    if (tab === 'delivery' || (product?.hide_care_delivery && tab === 'care')) {
      setTab('details')
    }
  }, [product?.hide_care_delivery, tab])

  if (!product) return null

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10">
        <img src={product.image} alt={product.name} className="h-80 w-full object-cover" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent" />
      </div>

      <div className="flex flex-col">
        <div className="text-sm text-slate-600">
          {product.category ?? product.type}
        </div>
        <div className="mt-2 text-2xl text-slate-900">{product.name}</div>
        <div className="mt-2 text-sm text-slate-800/90">{product.description}</div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(product.colors ?? []).map((c) => (
            <span key={c} className="rounded-full border border-white/25 bg-white/25 px-3 py-1 text-xs font-semibold text-slate-800">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 lux-glass rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80 uppercase">INSTRUCTIONS</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {tab === 'care' ? 'Traditional Chinese Handmade Silk Rope Bracelet Care' : 'How to enjoy this piece'}
              </div>
            </div>
            <div className="text-lg font-semibold text-slate-900">{formatMMK(product.price)}</div>
          </div>

          <Tabs tabs={tabs} active={tab} onChange={setTab} className="mt-4" />

          <div className="mt-4">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="text-sm text-slate-800/90"
            >
              {tab === 'details' && (
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              )}

              {tab === 'care' && !product.hide_care_delivery && (
                <ul className="space-y-2">
                  {careGuide.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-700">Premium feel. Minimal design. Handmade character.</div>
            <Button onClick={onAdd} className="shrink-0" type="button">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
