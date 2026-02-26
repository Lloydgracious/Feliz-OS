import { useEffect, useState } from 'react'
import { fsList } from './firestoreApi'

export function useCustomizationOptions() {
    const [knots, setKnots] = useState([])
    const [colors, setColors] = useState([])
    const [ropes, setRopes] = useState([])
    const [accessories, setAccessories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [k, c, r, a] = await Promise.all([
                    fsList('customization_knots'),
                    fsList('customization_colors'),
                    fsList('customization_ropes'),
                    fsList('customization_accessories')
                ])
                setKnots(k || [])
                setColors(c || [])
                setRopes(r || [])
                setAccessories(a || [])
            } catch (err) {
                console.error('Failed to load customization options', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return { knots, colors, ropes, accessories, loading }
}
