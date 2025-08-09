"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function PhoneVerification({ onVerified }) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  const handlePhoneSubmit = (e) => {
    e.preventDefault()

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would trigger an API call to send OTP
    toast({
      title: "OTP Sent",
      description: "A verification code has been sent to your phone",
    })

    setIsPhoneSubmitted(true)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (value && !/^\d+$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleVerifyOtp = (e) => {
    e.preventDefault()

    const otpValue = otp.join("")
    if (otpValue.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    // In a real app, this would be an API call to verify OTP
    setTimeout(() => {
      // Mock verification - in a real app, this would check against the server
      if (otpValue === "1234") {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified",
        })
        onVerified(phoneNumber)
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        })
      }
      setIsVerifying(false)
    }, 1500)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Phone Verification</h2>

      {!isPhoneSubmitted ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">We'll send a verification code to this number</p>
          </div>

          <Button type="submit" className="w-full">
            Send Verification Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp-0">Enter Verification Code</Label>
            <p className="text-sm text-gray-500 mb-4">We've sent a 4-digit code to {phoneNumber}</p>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <div className="text-center mt-4">
              <button type="button" className="text-sm text-primary hover:underline">
                Resend Code
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isVerifying}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>

          <p className="text-sm text-center text-gray-500">For demo purposes, use code: 1234</p>
        </form>
      )}
    </div>
  )
}
