import { formatMMK } from './utils'

export function calcCustomizationTotal({ base, knot1, color1, knot2, color2, rope, accessory }) {
  let total = Number(base || 0)

  if (knot1?.priceAdd) total += knot1.priceAdd
  if (color1?.priceAdd) total += color1.priceAdd
  if (rope?.priceAdd) total += rope.priceAdd
  if (accessory?.priceAdd) total += accessory.priceAdd

  // Secondary knot/color are optional; if selected, they add-on too.
  if (knot2?.priceAdd) total += knot2.priceAdd
  if (color2?.priceAdd) total += color2.priceAdd

  return total
}

export function formatAddonMMK(add) {
  const n = Number(add || 0)
  if (!n) return null
  return `+ ${formatMMK(n)}`
}
