import { useEffect, useState } from 'react'
import { fsList } from './firestoreApi'

export function useCustomizationOptions() {
    const [knots, setKnots] = useState([])
    const [colors, setColors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [k, c] = await Promise.all([
                    fsList('customization_knots'),
                    fsList('customization_colors')
                ])
                setKnots(k || [])
                setColors(c || [])
            } catch (err) {
                console.error('Failed to load customization options', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return { knots, colors, loading }
}
