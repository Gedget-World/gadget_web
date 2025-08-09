"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import ShopHeader from "@/components/shop-header"
import CheckoutFlow from "@/components/checkout/checkout-flow"
import CheckoutFlowGuest from "@/components/checkout/checkout-flow-guest"

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      router.push("/cart")
    }
  }, [cart, router])

  if (cart.length === 0) {
    return null // Prevent flash of content before redirect
  }

  return (
    <>
      <ShopHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {isAuthenticated ? <CheckoutFlow /> : <CheckoutFlowGuest />}
      </div>
    </>
  )
}
