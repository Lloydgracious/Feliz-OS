import { motion } from 'framer-motion'

export const defaultMilestones = [
  { year: '2024', title: 'Launch', text: 'A small studio drop exploring minimal luxury Chinese knots.' },
  { year: '2025', title: 'First 100 customers', text: 'Gift-ready packaging and customization refined through feedback.' },
  { year: '2025', title: 'Expansion', text: 'Bracelets + keychains with layered card-inspired presentation.' },
  { year: '2026', title: 'Artisan partnerships', text: 'Collaborations with knot masters for heritage-correct structures.' },
  { year: '2026', title: 'Exhibitions', text: 'Cultural craft showcases paired with modern design storytelling.' },
]

export default function MilestonesTimeline({ milestones = defaultMilestones }) {
  return (
    <div className="lux-glass rounded-[36px] p-8">
      <div className="text-sm font-semibold text-slate-900">Milestones</div>
      <p className="mt-2 text-sm text-slate-700">
        A short timeline of how Feliz grows rom a craft obsession into a joyful premium studio.
      </p>

      <div className="mt-7 relative ml-3">
        <div className="absolute left-3 top-0 h-full w-px bg-white/25" />

        <div className="space-y-7">
          {milestones.map((m, idx) => (
            <motion.div
              key={`${m.year}-${m.title}`}
              className="relative pl-12"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
            >
              <div className="absolute left-0 top-2 grid h-8 w-8 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-semibold text-white shadow-[0_18px_50px_rgba(2,68,120,0.25)]">
                {idx + 1}
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/20 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">{m.title}</div>
                  <div className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-800">
                    {m.year}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-700">{m.text}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
