"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentMethodForm({ onSubmit, onBack, isProcessing }) {
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (paymentMethod === "credit-card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        return
      }

      // Basic validation
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number",
          variant: "destructive",
        })
        return
      }

      if (cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV code",
          variant: "destructive",
        })
        return
      }
    }

    onSubmit({
      method: paymentMethod,
      details:
        paymentMethod === "credit-card"
          ? {
              cardNumber,
              cardName,
              expiryDate,
              cvv,
            }
          : {},
    })
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
          <div
            className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "credit-card" ? "border-primary" : "border-gray-200"}`}
          >
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="flex items-center cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 mr-2" />
              Credit / Debit Card
            </Label>
          </div>

          <div
            className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "digital-wallet" ? "border-primary" : "border-gray-200"}`}
          >
            <RadioGroupItem value="digital-wallet" id="digital-wallet" />
            <Label htmlFor="digital-wallet" className="flex items-center cursor-pointer flex-1">
              <Wallet className="h-5 w-5 mr-2" />
              Digital Wallet
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === "credit-card" && (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                />
              </div>
            </div>

            <p className="text-sm text-gray-500">For demo purposes, you can use any valid-looking card details</p>
          </div>
        )}

        {paymentMethod === "digital-wallet" && (
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-500">
              You'll be redirected to complete payment after clicking "Place Order"
            </p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  )
}
