import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/Container'
import PageTransition from '../components/PageTransition'
import SectionHeading from '../components/SectionHeading'
import MilestonesTimeline from '../components/MilestonesTimeline'
import { useSettings } from '../lib/useSettings'


export default function About() {
  const { data: settings } = useSettings([
    'about_eyebrow',
    'about_title',
    'about_subtitle',
    'about_story_title',
    'about_story_p1',
    'about_story_p2',
    'about_info1_k', 'about_info1_v',
    'about_info2_k', 'about_info2_v',
    'about_info3_k', 'about_info3_v',
    'about_info4_k', 'about_info4_v',
    'about_gallery_1',
    'about_gallery_2',
    'about_gallery_3',
    'about_gallery_4',
  ])

  const dynamicGallery = useMemo(() => {
    const fallbacks = [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=60',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1600&q=60',
      'https://images.unsplash.com/photo-1602526219045-5f5b0b5e0e2c?auto=format&fit=crop&w=1600&q=60',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8f45?auto=format&fit=crop&w=1600&q=60',
    ]
    return [
      settings?.about_gallery_1 || fallbacks[0],
      settings?.about_gallery_2 || fallbacks[1],
      settings?.about_gallery_3 || fallbacks[2],
      settings?.about_gallery_4 || fallbacks[3],
    ]
  }, [settings])

  const infoItems = [
    { k: settings?.about_info1_k || 'Cultural inspiration', v: settings?.about_info1_v || 'Symbolic knots' },
    { k: settings?.about_info2_k || 'Handcrafted philosophy', v: settings?.about_info2_v || 'Controlled tension' },
    { k: settings?.about_info3_k || 'Palette', v: settings?.about_info3_v || 'Ice blue + silver' },
    { k: settings?.about_info4_k || 'Output', v: settings?.about_info4_v || 'Bracelets & keychains' },
  ]

  return (
    <PageTransition>
      <Container className="py-14">
        <SectionHeading
          eyebrow={settings?.about_eyebrow || 'About'}
          title={settings?.about_title || 'Feliz — Bring ur joy with Feliz'}
          subtitle={settings?.about_subtitle || 'A minimal story section and an image gallery with scroll animations.'}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="lux-glass rounded-[36px] p-8">
            <div className="text-sm font-semibold text-slate-900">{settings?.about_story_title || 'Brand story'}</div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {settings?.about_story_p1 || 'Feliz is a premium handmade brand inspired by the quiet elegance of Chinese knotting — a craft where geometry carries symbolism. We focus on restraint: clean spacing, light-blue gradients, and refined materials that feel modern while respecting tradition.'}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {settings?.about_story_p2 || 'Each piece is designed for everyday wear: polished accents, soft cords, and minimalist silhouettes. Customization lets you select knot style and colorways — crafting a personal fortune token.'}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {infoItems.map((i, idx) => (
                <div key={idx} className="rounded-3xl border border-white/20 bg-white/20 p-5">
                  <div className="text-xs text-slate-600">{i.k}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="lux-glass rounded-[36px] p-6">
              <div className="text-sm font-semibold text-slate-900">Gallery</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {dynamicGallery.map((src, idx) => (
                  <motion.div
                    key={idx}
                    className="overflow-hidden rounded-3xl border border-white/15 bg-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                  >
                    <img src={src} alt="Brand gallery" className="h-44 w-full object-cover" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </div>

            <MilestonesTimeline />
          </div>
        </div>
      </Container>
    </PageTransition>
  )
}
