import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Container from '../components/Container'
import Modal from '../components/Modal'
import PageTransition from '../components/PageTransition'
import ProductCard from '../components/ProductCard'
import QuickViewContent from '../components/QuickViewContent'
import SectionHeading from '../components/SectionHeading'
import FeatureStrip from '../components/FeatureStrip'
import { useCart } from '../context/CartContext'
import { useHomeProducts, useProducts } from '../lib/useStoreData'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSettings } from '../lib/useSettings'

export default function Home() {
  const { addItem } = useCart()
  const [quick, setQuick] = useState(null)
  const [heroIdx, setHeroIdx] = useState(0)

  const heroImages = [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1602526219090-7df8e2a9f0a0?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1600&q=80',
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % 4) // Cycle through 4 slots
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const { data: homeProducts, loading: homeLoading } = useHomeProducts(6)
  const { data: allProducts, loading: allLoading } = useProducts()
  const products = allProducts ?? []
  const homeGridProducts = homeProducts ?? []

  const { data: settings } = useSettings([
    'home_hero_badge',
    'home_hero_title',
    'home_hero_subtitle',
    'home_hero_image',
    'home_hero_image_2',
    'home_hero_image_3',
    'home_hero_image_4',
    'home_collection_eyebrow',
    'home_collection_title',
    'home_collection_subtitle',
    'home_heritage_eyebrow',
    'home_heritage_title',
    'home_heritage_subtitle',
    'home_custom_eyebrow',
    'home_custom_title',
    'home_custom_subtitle',
  ])

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_18%_20%,rgba(24,189,212,0.28),transparent_58%),radial-gradient(700px_500px_at_82%_0%,rgba(255,255,255,0.75),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.6),rgba(255,255,255,0.12))]" />
          <div className="absolute inset-0 lux-pattern-hero" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1602526219090-7df8e2a9f0a0?auto=format&fit=crop&w=1800&q=60)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white/10" />
        </div>

        <Container className="relative grid gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/55 px-4 py-2 text-xs font-semibold tracking-wide text-slate-800 backdrop-blur">
              {settings?.home_hero_badge || 'Premium handmade Chinese knots'}
              <span className="h-1.5 w-1.5 rounded-full bg-feliz-blue" />
              Modern luxury palette
            </div>

            <h1 className="lux-hero-title mt-6 text-5xl leading-[0.92] sm:text-6xl">
              <span className="lux-hero-sheen">{settings?.home_hero_title || 'Craft Your Own Fortune'}</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-700 sm:text-base">
              {settings?.home_hero_subtitle ||
                'Feliz handmade bracelets & keychains — culturally inspired, minimal, and made to bring joy.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/customize" className="sm:w-auto">
                Customize Now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button as={Link} to="/shop" variant="secondary">
                Explore Collection
              </Button>
            </div>

          </div>

          <div className="relative">
            <motion.div
              className="absolute -right-10 -top-10 h-64 w-64 rounded-[36px] bg-gradient-to-br from-feliz-blue/35 to-feliz-yellow/20 blur-2xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-white/20 bg-white/10 shadow-[0_35px_90px_rgba(2,16,36,0.18)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroIdx}
                  src={
                    (heroIdx === 0 ? settings?.home_hero_image :
                      heroIdx === 1 ? settings?.home_hero_image_2 :
                        heroIdx === 2 ? settings?.home_hero_image_3 :
                          settings?.home_hero_image_4) || heroImages[heroIdx % heroImages.length]
                  }
                  alt="Handcrafted silk cord"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  loading="lazy"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/35 via-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/15 bg-white/20 px-5 py-4 backdrop-blur-xl">
                <div className="text-sm font-semibold text-slate-900">Handcrafted, culturally refined</div>
                <div className="mt-1 text-sm text-slate-700">
                  Explore keychains, knots, and custom colorways — designed to feel light, modern, and premium.
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

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

      <section className="mt-12">
        <Container>
          <FeatureStrip />
        </Container>
      </section>

      <section className="mt-14">
        <Container>
          <SectionHeading
            eyebrow={settings?.home_collection_eyebrow || 'Collection'}
            title={settings?.home_collection_title || 'Signature pieces, designed for modern layering'}
            subtitle={settings?.home_collection_subtitle || 'Our current drop — ready to wear or gift.'}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(homeLoading || allLoading) && homeGridProducts.length === 0 ? (
              <div className="py-10">
                <LoadingSpinner label="Loading products" />
              </div>
            ) : (
              homeGridProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={(prod) => addItem({ id: prod.id, name: prod.name, price: prod.price })}
                  onQuickView={(prod) => setQuick(prod)}
                />
              ))
            )}
          </div>
        </Container>
      </section>

      <section className="mt-16">
        <Container>
          <div className="relative overflow-hidden rounded-[36px] border border-white/20 bg-white/15">
            <div className="absolute inset-0 bg-[radial-gradient(900px_380px_at_20%_0%,rgba(124,199,255,0.35),transparent_65%),linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0.10))]" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1602526219090-7df8e2a9f0a0?auto=format&fit=crop&w=1800&q=60)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-feliz-blue">COLLECTION</div>
                <div className="mt-2 text-3xl text-slate-900 sm:text-4xl">A small drop. A calm luxury feel.</div>
                <p className="mt-3 max-w-xl text-sm text-slate-700">
                  Discover keychains and knot pieces designed for gifting, collecting, and daily wear — with the Feliz signature palette.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button as={Link} to="/shop">
                    Shop the collection <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button as={Link} to="/blog" variant="secondary">
                    Watch videos
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {products.slice(0, 2).map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    onClick={() => setQuick(p)}
                    className="lux-glass group rounded-3xl p-4 text-left"
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  >
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-36 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-slate-900">{p.name}</div>
                    <div className="mt-1 text-xs text-slate-600">Tap for Quick View</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="mt-16">
        <Container className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="lux-glass rounded-[32px] p-8">
            <SectionHeading
              eyebrow={settings?.home_heritage_eyebrow || 'Heritage'}
              title={settings?.home_heritage_title || 'A quiet cultural story'}
              subtitle={
                settings?.home_heritage_subtitle ||
                'Chinese knots are symbols — protection, continuity, prosperity. We translate those meanings into modern, minimal luxury.'
              }
            />
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li>Hand-tied by artisans using traditional structures</li>
              <li>Elevated palette: ice blue, white, silver accents</li>
              <li>Designed for gifting, collecting, and daily wear</li>
            </ul>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-[32px]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <img
              src="https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=1600&q=60"
              alt="Craft detail"
              className="h-[320px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/35 via-transparent" />
          </motion.div>
        </Container>
      </section>

      <section className="mt-16">
        <Container className="lux-glass rounded-[36px] p-8 sm:p-10">
          <SectionHeading
            eyebrow={settings?.home_custom_eyebrow || 'Customization'}
            title={settings?.home_custom_title || 'Personalization in five refined steps'}
            subtitle={
              settings?.home_custom_subtitle ||
              'Pick knot styles, choose colors, review with a live preview — then add to cart.'
            }
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-white/20 bg-white/20 p-6">
                <div className="text-xs font-semibold tracking-[0.2em] text-feliz-blue">STEP 0{i}</div>
                <div className="mt-2 text-xl text-slate-900">
                  {i === 1 ? 'Pick your knot' : i === 2 ? 'Select colorways' : 'Review & add to cart'}
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  {i === 1
                    ? 'Dragon, Mystic, Double Coin, Clover, Fortune — each with a meaning.'
                    : i === 2
                      ? 'Luxury tones: sky blue, white jade, silver and more.'
                      : 'See your design, price estimate, and a premium add-to-cart interaction.'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button as={Link} to="/customize" variant="yellow">
              Start Customizing <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  )
}
