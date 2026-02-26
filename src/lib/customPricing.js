import { formatMMK } from './utils'

export function calcCustomizationTotal({ base, knots = [], colors = [], rope, accessory }) {
  let total = Number(base || 0)

  // Sum up all selected knots
  knots.forEach(k => {
    if (k?.priceAdd) total += k.priceAdd
  })

  // Sum up all selected colors
  colors.forEach(c => {
    if (c?.priceAdd) total += c.priceAdd
  })

  if (rope?.priceAdd) total += rope.priceAdd
  if (accessory?.priceAdd) total += accessory.priceAdd

  return total
}

export function formatAddonMMK(add) {
  const n = Number(add || 0)
  if (!n) return null
  return `+ ${formatMMK(n)}`
}
