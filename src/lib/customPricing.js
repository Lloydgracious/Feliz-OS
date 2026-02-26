import { formatMMK } from './utils'

export function calcCustomizationTotal({ base, knots = [], color1, color2, rope, accessory }) {
  let total = Number(base || 0)

  // Sum up all selected knots
  knots.forEach(k => {
    if (k?.priceAdd) total += k.priceAdd
  })

  if (color1?.priceAdd) total += color1.priceAdd
  if (color2?.priceAdd) total += color2.priceAdd
  if (rope?.priceAdd) total += rope.priceAdd
  if (accessory?.priceAdd) total += accessory.priceAdd

  return total
}

export function formatAddonMMK(add) {
  const n = Number(add || 0)
  if (!n) return null
  return `+ ${formatMMK(n)}`
}
