import { useMemo, useState } from 'react'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import Modal from '../components/Modal'
import FilterPill from '../components/FilterPill'
import { useProducts, useProductFilters } from '../lib/useStoreData'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSettings } from '../lib/useSettings'
import { useCart } from '../context/CartContext'

import QuickViewContent from '../components/QuickViewContent'

export default function Shop() {
  const { addItem } = useCart()
  const { data, loading } = useProducts()
  const products = data ?? []
  const productFilters = useProductFilters(products)
  const [category, setCategory] = useState('All')
  const [color, setColor] = useState('All')
  const [quick, setQuick] = useState(null)

  const { data: settings } = useSettings(['shop_eyebrow', 'shop_title', 'shop_subtitle', 'shop_banner'])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCategory = category === 'All' || (p.category ?? p.type) === category
      const okColor = color === 'All' || (Array.isArray(p.colors) && p.colors.includes(color))
      return okCategory && okColor
    })
  }, [products, category, color])

  return (
    <PageTransition>
      <Container className="py-14">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={settings?.shop_eyebrow || 'Collection'}
            title={settings?.shop_title || 'Shop the curated drop'}
            subtitle={
              settings?.shop_subtitle ||
              'Filter by category, color, and knot — then open a quick view modal or add to cart with a smooth premium interaction.'
            }
          />

          <div className="flex flex-col gap-3">
            {!!settings?.shop_banner && (
              <div className="lux-glass rounded-3xl px-5 py-4 text-sm text-slate-800">{settings.shop_banner}</div>
            )}
            <div className="lux-glass rounded-3xl px-5 py-4 text-sm text-slate-700">
              Showing <span className="font-semibold text-slate-900">{filtered.length}</span> items
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 lux-glass rounded-3xl p-10">
            <LoadingSpinner label="Loading products" />
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
              <aside className="lux-glass h-fit rounded-3xl p-6">
                <div className="text-sm font-semibold text-slate-900">Filters</div>

                <div className="mt-5">
                  <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">CATEGORY</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['All', ...productFilters.categories].map((c) => (
                      <FilterPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
                    ))}
                  </div>
                </div>


                <div className="mt-6">
                  <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">COLOR</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['All', ...productFilters.colors].map((c) => (
                      <FilterPill key={c} label={c} active={color === c} onClick={() => setColor(c)} />
                    ))}
                  </div>
                </div>

                <button
                  className="mt-7 w-full rounded-2xl border border-white/20 bg-white/30 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white/45"
                  onClick={() => {
                    setCategory('All')
                    setColor('All')
                  }}
                  type="button"
                >
                  Reset
                </button>
              </aside>

              <div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={(prod) => setQuick(prod)}
                      onAdd={(prod) => addItem({ id: prod.id, name: prod.name, price: prod.price })}
                    />
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="mt-10 lux-glass rounded-3xl p-10 text-sm text-slate-700">
                    No products match your filters.
                  </div>
                )}
              </div>
            </div>

            <Modal open={!!quick} title={quick?.name ?? 'Quick view'} onClose={() => setQuick(null)}>
              {quick && (
                <QuickViewContent
                  product={quick}
                  onAdd={() => {
                    addItem({ id: quick.id, name: quick.name, price: quick.price })
                    setQuick(null)
                  }}
                />
              )}
            </Modal>
          </>
        )}
      </Container>
    </PageTransition>
  )
}
