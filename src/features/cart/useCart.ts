import { createContext, useContext, type Dispatch } from 'react'
import type { CartAction, CartState } from './cart'

export const CartContext = createContext<{
  state: CartState
  dispatch: Dispatch<CartAction>
  count: number
  totalMinor: number
} | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('CartProvider is required.')
  return cart
}
