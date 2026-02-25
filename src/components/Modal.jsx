import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="fixed inset-0 z-50 bg-slate-950/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close modal"
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[60] w-[min(92vw,860px)] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
          >
            <div className="lux-glass flex max-h-[80vh] flex-col rounded-3xl border border-white/25 p-5 shadow-[0_30px_90px_rgba(2,16,36,0.25)] sm:max-h-[86vh] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold text-slate-900">{title}</div>
                <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/35" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
