import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import StepIndicator from '../components/StepIndicator'
import KnotCard from '../components/KnotCard'
import ColorDot from '../components/ColorDot'
import BraceletPreview from '../components/BraceletPreview'
import { useCustomizationOptions } from '../lib/useCustomization'
import { useSettings } from '../lib/useSettings'
import LoadingSpinner from '../components/LoadingSpinner'
import { calcCustomizationTotal, formatAddonMMK } from '../lib/customPricing'
import { useCart } from '../context/CartContext'

const steps = [
  { key: 'knots', label: 'Knot Styles' },
  { key: 'color1', label: 'Primary Color' },
  { key: 'rope', label: 'Rope Type' },
  { key: 'color2', label: 'Secondary Color' },
  { key: 'accessory', label: 'Accessories' },
  { key: 'review', label: 'Review' },
]

import { formatMMK } from '../lib/utils'

export default function Customize() {
  const { addItem } = useCart()
  const [active, setActive] = useState(0)

  const { knots: knotStyles, colors: colorOptions, ropes: ropeOptions, accessories: accessoryOptions, loading } = useCustomizationOptions()
  const { data: settings } = useSettings(['base_customization_price'])

  const [selectedKnots, setSelectedKnots] = useState([]) // Array of 2-4 knots
  const [color1, setColor1] = useState(null)
  const [rope, setRope] = useState(null)
  const [color2, setColor2] = useState(null)
  const [accessory, setAccessory] = useState(null)

  // Initialize colors when data loads if not set
  useEffect(() => {
    if (!loading) {
      if (colorOptions.length > 0) {
        if (!color1) setColor1(colorOptions[0])
        if (!color2) setColor2(colorOptions.length > 1 ? colorOptions[1] : colorOptions[0])
      }
      if (ropeOptions.length > 0 && !rope) {
        setRope(ropeOptions[0])
      }
    }
  }, [loading, colorOptions, color1, color2, ropeOptions, rope])

  const baseCustomizationPrice = Number(settings?.base_customization_price || 120000)

  const chosen = useMemo(() => {
    return { selectedKnots, color1, rope, color2, accessory }
  }, [selectedKnots, color1, rope, color2, accessory])

  const estimate = useMemo(() => {
    return calcCustomizationTotal({
      base: baseCustomizationPrice,
      knots: selectedKnots,
      color1,
      rope,
      color2,
      accessory,
    })
  }, [baseCustomizationPrice, selectedKnots, color1, rope, color2, accessory])

  const canNext = useMemo(() => {
    if (active === 0) return selectedKnots.length >= 2 && selectedKnots.length <= 4
    if (active === 1) return !!color1
    if (active === 2) return !!rope
    if (active === 3) return !!color2
    return true
  }, [active, selectedKnots, color1, rope, color2])

  const summaryLabel = useMemo(() => {
    return selectedKnots.map(k => k.name).join(' + ') || '—'
  }, [selectedKnots])

  const meta = useMemo(() => {
    return `Knots: ${summaryLabel} • Rope: ${rope?.name ?? '—'} • Colors: ${color1?.name ?? '—'} + ${color2?.name ?? '—'} • Acc: ${accessory?.name ?? 'None'}`
  }, [summaryLabel, rope, color1, color2, accessory])

  if (loading) return <LoadingSpinner label="Loading designer" />

  function next() {
    setActive((n) => Math.min(steps.length - 1, n + 1))
  }

  function prev() {
    setActive((n) => Math.max(0, n - 1))
  }

  return (
    <PageTransition>
      <Container className="py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Customization"
            title="Design your piece"
            subtitle="An interactive multi-step flow with premium motion and a live preview."
          />
          <div className="lux-glass rounded-3xl px-5 py-4 text-sm text-slate-700">
            Price estimate: <span className="font-semibold text-slate-900">{formatMMK(baseCustomizationPrice)}</span> <span className="text-slate-500">+ add-ons</span> — <span className="font-semibold text-slate-900">{formatMMK(estimate)}</span>
          </div>
        </div>

        <div className="mt-8">
          <StepIndicator steps={steps} activeIndex={active} onStep={setActive} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="lux-glass rounded-[36px] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[active].key}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {active === 0 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 01</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Choose 2 to 4 knots</h2>
                    <p className="mt-2 text-sm text-slate-700">
                      Select at least two signature knots (up to four) to create your unique pattern.
                    </p>

                    <div className="mt-6">
                      {knotStyles.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2">
                          {knotStyles.map((k) => {
                            const isSelected = selectedKnots.some(pk => pk.id === k.id)
                            return (
                              <KnotCard
                                key={k.id}
                                knot={k}
                                selected={isSelected}
                                onSelect={() => {
                                  if (isSelected) {
                                    setSelectedKnots(prev => prev.filter(p => p.id !== k.id))
                                  } else if (selectedKnots.length < 4) {
                                    setSelectedKnots(prev => [...prev, k])
                                  } else {
                                    toast.error('Maximum 4 knots allowed')
                                  }
                                }}
                                rightNote={formatAddonMMK(k.priceAdd)}
                              />
                            )
                          })}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                          No knot styles available yet. Check back soon!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {active === 1 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 02</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Select primary color</h2>
                    <p className="mt-2 text-sm text-slate-700">Choose the dominant cord tone for your piece.</p>

                    <div className="mt-6">
                      {colorOptions.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {colorOptions.map((c) => (
                            <ColorDot
                              key={c.id}
                              color={c}
                              selected={color1?.id === c.id}
                              onSelect={setColor1}
                              rightNote={formatAddonMMK(c.priceAdd)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                          No colors available.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {active === 2 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 03</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Bracelet rope type</h2>
                    <p className="mt-2 text-sm text-slate-700">Choose the rope thickness that suits your style—from bold thick cords to delicate thin ones.</p>
                    <div className="mt-6 grid gap-4">
                      {ropeOptions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setRope(r)}
                          className={`flex items-center justify-between rounded-2xl border p-5 transition ${rope?.id === r.id ? 'border-sky-500 bg-sky-500/10' : 'border-white/20 bg-white/20 hover:bg-white/30'}`}
                        >
                          <div className="text-left">
                            <div className="font-semibold text-slate-900">{r.name}</div>
                            <div className="text-xs text-slate-600">Premium quality cord</div>
                          </div>
                          <div className="text-sm font-semibold text-sky-600">{formatAddonMMK(r.priceAdd)}</div>
                        </button>
                      ))}
                      {ropeOptions.length === 0 && <div className="p-10 text-center text-slate-500">No rope options available.</div>}
                    </div>
                  </div>
                )}

                {active === 3 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 04</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Select secondary color</h2>
                    <p className="mt-2 text-sm text-slate-700">
                      Choose the accent tone — used for secondary cord detail and binding.
                    </p>

                    <div className="mt-6">
                      {colorOptions.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {colorOptions.map((c) => (
                            <ColorDot
                              key={c.id}
                              color={c}
                              selected={color2?.id === c.id}
                              onSelect={setColor2}
                              rightNote={formatAddonMMK(c.priceAdd)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                          No accent colors available.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {active === 4 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 05</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Add accessories / coins</h2>
                    <p className="mt-2 text-sm text-slate-700">Select a unique charm or coin to add a personal touch to your design.</p>
                    <div className="mt-6 grid gap-4 grid-cols-2">
                      <button
                        onClick={() => setAccessory(null)}
                        className={`rounded-2xl border p-4 text-center transition ${!accessory ? 'border-sky-500 bg-sky-500/10' : 'border-white/20 bg-white/20 hover:bg-white/30'}`}
                      >
                        <div className="mx-auto h-12 w-12 rounded-full bg-slate-200/50 grid place-items-center text-xs text-slate-500">None</div>
                        <div className="mt-3 text-sm font-semibold text-slate-900">No Accessory</div>
                      </button>
                      {accessoryOptions.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => setAccessory(a)}
                          className={`group relative rounded-2xl border p-4 text-center transition ${accessory?.id === a.id ? 'border-sky-500 bg-sky-500/10' : 'border-white/20 bg-white/20 hover:bg-white/30'}`}
                        >
                          <img src={a.image} className="mx-auto h-12 w-12 rounded-lg object-cover bg-white" alt={a.name} />
                          <div className="mt-3 text-sm font-semibold text-slate-900">{a.name}</div>
                          <div className="mt-1 text-[10px] text-sky-600 font-semibold">{formatAddonMMK(a.priceAdd)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {active === 5 && (
                  <div>
                    <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80">STEP 06</div>
                    <h2 className="mt-2 text-3xl text-slate-900">Review your design</h2>
                    <p className="mt-2 text-sm text-slate-700">
                      Confirm your selections and add your custom creation to the cart.
                    </p>

                    <div className="mt-6 grid gap-4">
                      <div className="rounded-3xl border border-white/20 bg-white/20 p-5">
                        <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80 uppercase">Summary</div>
                        <dl className="mt-4 grid gap-3 text-sm">
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-slate-600">Knots</dt>
                            <dd className="font-semibold text-slate-900 text-right">{selectedKnots.map(k => k.name).join(', ')}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-slate-600">Rope</dt>
                            <dd className="font-semibold text-slate-900">{rope?.name}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-slate-600">Colors</dt>
                            <dd className="font-semibold text-slate-900 text-right">{color1?.name} / {color2?.name}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <dt className="text-slate-600">Accessory</dt>
                            <dd className="font-semibold text-slate-900">{accessory?.name ?? 'None'}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="rounded-3xl border border-white/20 bg-white/20 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-semibold tracking-[0.2em] text-sky-700/80 uppercase">TOTAL ESTIMATE</div>
                            <div className="mt-2 text-2xl font-semibold text-slate-900">{formatMMK(estimate)}</div>
                          </div>
                          <div className="rounded-2xl bg-white/50 px-4 py-2 text-xs font-semibold text-slate-800">
                            Handmade • 48h
                          </div>
                        </div>

                        <button
                          type="button"
                          className="mt-5 w-full rounded-2xl bg-sky-600 px-5 py-4 text-sm font-semibold text-white hover:brightness-105"
                          onClick={() => {
                            addItem({
                              id: `custom-${Date.now()}`,
                              name: `Custom Bracelet (${selectedKnots[0]?.name ?? 'Knot'})`,
                              price: estimate,
                              meta,
                            })
                            toast.success('Custom design added to cart!')
                          }}
                        >
                          <span className="inline-flex items-center justify-center gap-2">
                            <Check className="h-4 w-4" /> Add to Cart
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={active === 0}
                className={`lux-ring inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${active === 0
                  ? 'border-white/10 bg-white/10 text-slate-500'
                  : 'border-white/25 bg-white/25 text-slate-800 hover:bg-white/40'
                  }`}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="text-xs text-slate-600">Step {active + 1} of {steps.length}</div>

              <button
                type="button"
                onClick={next}
                disabled={!canNext || active === steps.length - 1}
                className={`lux-ring inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${!canNext || active === steps.length - 1
                  ? 'border border-white/10 bg-white/10 text-slate-500'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-105'
                  }`}
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <BraceletPreview primary={color1} secondary={color2} knotLabel={summaryLabel} />
            <div className="lux-glass rounded-[32px] p-6">
              <div className="text-sm font-semibold text-slate-900">Your Selections</div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color1?.hex }} />
                  <span className="text-xs text-slate-700">Primary: {color1?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color2?.hex }} />
                  <span className="text-xs text-slate-700">Secondary: {color2?.name}</span>
                </div>
                {accessory && (
                  <div className="flex items-center gap-3">
                    <img src={accessory.image} className="h-6 w-6 rounded object-cover" />
                    <span className="text-xs text-slate-700">Accessory: {accessory.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageTransition>
  )
}
