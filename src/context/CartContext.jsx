import { createContext, useContext, useMemo, useReducer } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen }
    case 'ADD_ITEM': {
      const { item } = action
      const existing = state.items.find((i) => i.id === item.id)
      let items
      if (existing) {
        items = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i,
        )
      } else {
        items = [...state.items, { ...item, quantity: item.quantity ?? 1 }]
      }
      toast.success('Added to cart')
      return { ...state, items, isOpen: true }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.id !== action.id)
      toast('Removed from cart', { icon: '🗑️' })
      return { ...state, items }
    }
    case 'SET_QTY': {
      const { id, quantity } = action
      const q = Math.max(1, Number(quantity) || 1)
      const items = state.items.map((i) => (i.id === id ? { ...i, quantity: q } : i))
      return { ...state, items }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

const initialState = {
  isOpen: false,
  items: [],
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    return { subtotal, itemCount }
  }, [state.items])

  const api = useMemo(
    () => ({
      ...state,
      ...totals,
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
      toggleCart: () => dispatch({ type: 'TOGGLE' }),
      addItem: (item) => dispatch({ type: 'ADD_ITEM', item }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      setQty: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state, totals],
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
