import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}) {
  const base =
    'lux-ring inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium transition '

  const variants = {
    primary:
      'bg-gradient-to-r from-feliz-blue to-cyan-700 text-white shadow-[0_14px_40px_rgba(24,189,212,0.28)] hover:brightness-110',
    secondary:
      'lux-glass text-slate-900 hover:bg-white/20',
    yellow:
      'bg-gradient-to-r from-feliz-yellow to-amber-400 text-slate-900 font-bold shadow-[0_14px_40px_rgba(240,200,0,0.28)] hover:brightness-110',
    ghost: 'text-slate-800 hover:bg-white/25',
  }

  return (
    <Comp
      className={cn(base, variants[variant], className)}
      {...props}
    >
      <motion.span whileTap={{ scale: 0.98 }}>{children}</motion.span>
    </Comp>
  )
}
