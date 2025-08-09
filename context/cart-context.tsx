"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type CartItem = {
  id: number
  name: string
  price: number
  image?: string
  images?: string[]
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (product: CartItem) => void
  updateQuantity: (product: CartItem, quantity: number) => void
  clearCart: () => void
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Update localStorage and cart count whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
    setCartCount(cart.reduce((count, item) => count + item.quantity, 0))
  }, [cart])

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists in cart (with same size and color if applicable)
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor,
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity
        return updatedCart
      } else {
        // Add new item to cart
        return [...prevCart, product]
      }
    })
  }

  const removeFromCart = (product: CartItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === product.id &&
            item.selectedSize === product.selectedSize &&
            item.selectedColor === product.selectedColor
          ),
      ),
    )
  }

  const updateQuantity = (product: CartItem, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id &&
        item.selectedSize === product.selectedSize &&
        item.selectedColor === product.selectedColor
          ? { ...item, quantity }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
