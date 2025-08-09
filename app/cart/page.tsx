"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import ShopHeader from "@/components/shop-header"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)

    // Set shipping (free over $100)
    const newShipping = newSubtotal > 100 ? 0 : 10
    setShipping(newShipping)

    // Calculate total
    setTotal(newSubtotal + newShipping)
  }, [cart])

  if (cart.length === 0) {
    return (
      <>
        <ShopHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <ShopHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="hidden md:grid md:grid-cols-5 text-sm font-medium text-gray-500 mb-4">
                  <div className="md:col-span-2">Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div>Total</div>
                </div>

                <Separator className="mb-6" />

                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="mb-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      {/* Product Image & Info */}
                      <div className="md:col-span-2 flex gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/product/${item.id}`} className="hover:underline">
                              {item.name}
                            </Link>
                          </h3>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && <span> | Color: {item.selectedColor}</span>}
                          </div>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="text-sm text-red-500 flex items-center mt-2 md:hidden"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-gray-900">${item.price.toFixed(2)}</div>

                      {/* Quantity */}
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Total & Remove */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item)}
                          className="text-gray-400 hover:text-red-500 hidden md:block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Button className="w-full mt-6" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-xs text-gray-500 mt-4">
                  <p>Shipping calculated at checkout. Taxes may apply.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
