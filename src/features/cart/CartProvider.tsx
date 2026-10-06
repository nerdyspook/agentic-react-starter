import { useReducer, type ReactNode } from 'react'
import { cartReducer, summarizeCart } from './cart'
import { CartContext } from './useCart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    lines: [],
    error: null,
    checkout: null,
  })
  const summary = summarizeCart(state.lines)
  return (
    <CartContext value={{ state, dispatch, ...summary }}>
      {children}
    </CartContext>
  )
}
