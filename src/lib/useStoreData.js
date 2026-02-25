import { useMemo } from 'react'
import { useAsync } from './useAsync'
import { fetchProducts, fetchProductsForHome, fetchVlogExperiencePosts, fetchVlogVideoPosts } from './dataApi'

export function useProducts() {
  return useAsync(fetchProducts, [])
}

export function useHomeProducts(limit = 6) {
  return useAsync(() => fetchProductsForHome(limit), [limit])
}

export function useVlogExperiencePosts() {
  return useAsync(fetchVlogExperiencePosts, [])
}

export function useVlogVideoPosts() {
  return useAsync(fetchVlogVideoPosts, [])
}

export function useProductFilters(products) {
  return useMemo(() => {
    const categories = new Set()
    const colors = new Set()

    for (const p of products ?? []) {
      if (p.category || p.type) categories.add(p.category ?? p.type)
      for (const c of p.colors ?? []) colors.add(c)
    }

    return {
      categories: Array.from(categories).sort(),
      colors: Array.from(colors).sort(),
    }
  }, [products])
}
