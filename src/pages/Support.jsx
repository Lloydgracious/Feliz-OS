import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import { cn } from '../lib/utils'
import { useSettings } from '../lib/useSettings'
import { fsList } from '../lib/firestoreApi'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Support() {
  const [open, setOpen] = useState(0)
  const [faqs, setFaqs] = useState([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)

  const { data: settings, loading: loadingSettings } = useSettings([
    'support_eyebrow', 'support_title', 'support_subtitle',
    'support_contact_eyebrow', 'support_contact_title', 'support_contact_subtitle',
    'support_contact_email'
  ])

  useEffect(() => {
    async function loadFaqs() {
      try {
        const data = await fsList('support_faqs')
        setFaqs(data || [])
      } catch (e) {
        console.error('Failed to load FAQs', e)
      } finally {
        setLoadingFaqs(false)
      }
    }
    loadFaqs()
  }, [])

  if (loadingSettings || loadingFaqs) return <LoadingSpinner label="Loading support" />

  const displayFaqs = faqs.length > 0 ? faqs : [
    { q: 'What do the knot styles mean?', a: 'Chinese knots often symbolize protection, continuity, and prosperity.' },
    { q: 'How does customization work?', a: 'Choose your styles and check out with bank transfer.' }
  ]

  return (
    <PageTransition>
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <section>
            <SectionHeading
              eyebrow={settings?.support_eyebrow || 'FAQ'}
              title={settings?.support_title || 'Support, kept simple'}
              subtitle={settings?.support_subtitle || 'Quick answers about knots, customization, and checkout.'}
            />

            <div className="mt-8 grid gap-4">
              {displayFaqs.map((f, idx) => {
                const isOpen = open === idx
                return (
                  <div key={idx} className="lux-glass rounded-3xl">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() => setOpen((n) => (n === idx ? -1 : idx))}
                    >
                      <div className="text-sm font-semibold text-slate-900">{f.q}</div>
                      <ChevronDown className={cn('h-5 w-5 text-slate-700 transition', isOpen && 'rotate-180')} />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-sm text-slate-700">{f.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
              {faqs.length === 0 && !loadingFaqs && (
                <div className="text-sm text-slate-500 italic p-4">No FAQ items found. Update in Admin.</div>
              )}
            </div>
          </section>

          <section className="lux-glass rounded-[36px] p-8">
            <SectionHeading
              eyebrow={settings?.support_contact_eyebrow || 'Contact'}
              title={settings?.support_contact_title || 'Let’s talk craftsmanship'}
              subtitle={settings?.support_contact_subtitle || 'Send us a message and we’ll reply as soon as possible.'}
            />

            <div className="mt-6 grid gap-4">
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                placeholder="Full name"
              />
              <input
                className="lux-ring rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                placeholder="Phone or Email"
              />
              <textarea
                rows={5}
                className="lux-ring resize-none rounded-2xl border border-white/25 bg-white/40 px-4 py-3 text-sm"
                placeholder="Your message"
              />
              <button
                className="rounded-2xl bg-sky-600 px-5 py-4 text-sm font-semibold text-white hover:brightness-105"
                type="button"
              >
                Submit
              </button>

              <div className="mt-2 rounded-3xl border border-white/15 bg-white/15 p-5 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Feliz</div>
                <div className="mt-1 text-sm text-slate-700">Email: {settings?.support_contact_email || 'hello@feliz.example'}</div>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </PageTransition>
  )
}
