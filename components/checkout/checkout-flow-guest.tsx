"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, MapPin, Phone, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import PhoneVerification from "@/components/checkout/phone-verification"
import PersonalInfoForm from "@/components/checkout/personal-info-form"
import AddressForm from "@/components/checkout/address-form"
import PaymentMethodForm from "@/components/checkout/payment-method-form"
import OrderSummary from "@/components/checkout/order-summary"

const steps = [
  { id: "phone", name: "Phone Verification", icon: Phone },
  { id: "personal", name: "Personal Info", icon: User },
  { id: "address", name: "Shipping Address", icon: MapPin },
  { id: "payment", name: "Payment Method", icon: CreditCard },
  { id: "confirmation", name: "Confirmation", icon: Check },
]

export default function CheckoutFlowGuest() {
  const [currentStep, setCurrentStep] = useState("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [personalInfo, setPersonalInfo] = useState(null)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const { cart, clearCart } = useCart()

  const handlePhoneVerified = (phone) => {
    setPhoneNumber(phone)
    setCurrentStep("personal")
    window.scrollTo(0, 0)
  }

  const handlePersonalInfoSubmit = (info) => {
    setPersonalInfo(info)
    setCurrentStep("address")
    window.scrollTo(0, 0)
  }

  const handleAddressSubmit = (address) => {
    setShippingAddress(address)
    setCurrentStep("payment")
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (payment) => {
    setPaymentMethod(payment)
    processOrder()
  }

  const processOrder = async () => {
    setIsProcessing(true)

    try {
      // In a real app, this would be an API call to process the order
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random order ID
      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderId(newOrderId)

      toast({
        title: "Order Placed Successfully",
        description: `Your order #${newOrderId} has been placed.`,
      })

      setCurrentStep("confirmation")
      clearCart()

      // After 3 seconds, redirect to order tracking
      setTimeout(() => {
        router.push(`/track-order?id=${newOrderId}`)
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const goBack = () => {
    if (currentStep === "personal") {
      setCurrentStep("phone")
    } else if (currentStep === "address") {
      setCurrentStep("personal")
    } else if (currentStep === "payment") {
      setCurrentStep("address")
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="md:flex-1">
                <div
                  className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                    currentStep === step.id
                      ? "border-primary"
                      : stepIdx < steps.findIndex((s) => s.id === currentStep)
                        ? "border-primary"
                        : "border-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium">
                    <step.icon
                      className={`mr-2 inline-block h-5 w-5 ${
                        currentStep === step.id || stepIdx < steps.findIndex((s) => s.id === currentStep)
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    />
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Step Content */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {currentStep === "phone" && <PhoneVerification onVerified={handlePhoneVerified} />}

          {currentStep === "personal" && (
            <PersonalInfoForm onSubmit={handlePersonalInfoSubmit} onBack={goBack} phoneNumber={phoneNumber} />
          )}

          {currentStep === "address" && (
            <AddressForm onSubmit={handleAddressSubmit} onBack={goBack} initialData={personalInfo} />
          )}

          {currentStep === "payment" && (
            <PaymentMethodForm onSubmit={handlePaymentSubmit} onBack={goBack} isProcessing={isProcessing} />
          )}

          {currentStep === "confirmation" && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold">Order Confirmed!</h2>
              <p className="mt-2 text-gray-500">
                Thank you for your order. Your order number is <span className="font-medium">{orderId}</span>.
              </p>
              <p className="mt-1 text-gray-500">
                We've sent a confirmation email to <span className="font-medium">{personalInfo?.email}</span>.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                You will be redirected to the order tracking page in a few seconds...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <OrderSummary
          cart={cart}
          shippingAddress={shippingAddress}
          showShippingInfo={currentStep !== "phone" && currentStep !== "personal" && currentStep !== "address"}
        />
      </div>
    </div>
  )
}
