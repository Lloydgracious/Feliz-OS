import { motion } from 'framer-motion'
import { Sparkles, Shield, Gem } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Refined palette',
    text: 'Ice blue, white, and silver accents — designed to feel light and premium.',
  },
  {
    icon: Gem,
    title: 'Handmade finishing',
    text: 'Hand-tensioned knotwork with careful inspection before dispatch.',
  },
  {
    icon: Shield,
    title: 'Meaningful craft',
    text: 'Cultural symbolism translated into a modern, minimal everyday piece.',
  },
]

export default function FeatureStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((f, idx) => (
        <motion.div
          key={f.title}
          className="lux-glass rounded-3xl p-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: idx * 0.04 }}
        >
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/40">
              <f.icon className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{f.title}</div>
              <div className="mt-1 text-sm text-slate-700">{f.text}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
