"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function OrderSummary({ cart, shippingAddress, showShippingInfo }) {
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(newSubtotal)

    // Set shipping (free over $100)
    const newShipping = newSubtotal > 100 ? 0 : 10
    setShipping(newShipping)

    // Calculate tax (assume 8%)
    const newTax = newSubtotal * 0.08
    setTax(newTax)

    // Calculate total
    setTotal(newSubtotal + newShipping + newTax)
  }, [cart])

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Order Summary</h2>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className={`space-y-4 ${isExpanded ? "block" : "hidden md:block"}`}>
          {/* Items */}
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-cover" />
                  {item.quantity > 1 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {item.quantity}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  {item.selectedSize && item.selectedColor && (
                    <p className="text-xs text-gray-500">
                      {item.selectedSize} / {item.selectedColor}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Shipping Address */}
          {showShippingInfo && shippingAddress && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">Shipping To:</h3>
              <p className="text-sm">{shippingAddress.fullName}</p>
              <p className="text-sm">{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && <p className="text-sm">{shippingAddress.addressLine2}</p>}
              <p className="text-sm">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p className="text-sm">{shippingAddress.country}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
