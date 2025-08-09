"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Truck, Package, Home } from "lucide-react"
import ShopHeader from "@/components/shop-header"

// Mock tracking data
const mockTrackingData = {
  "ORD-12345": {
    orderId: "ORD-12345",
    status: "Delivered",
    estimatedDelivery: "May 18, 2023",
    trackingNumber: "TRK9876543210",
    carrier: "FedEx",
    events: [
      {
        date: "May 15, 2023",
        time: "14:30",
        status: "Delivered",
        location: "New York, NY",
        description: "Package delivered to recipient",
        completed: true,
      },
      {
        date: "May 14, 2023",
        time: "09:15",
        status: "Out for Delivery",
        location: "New York, NY",
        description: "Package is out for delivery",
        completed: true,
      },
      {
        date: "May 13, 2023",
        time: "18:45",
        status: "Arrived at Facility",
        location: "New York, NY",
        description: "Package has arrived at carrier facility",
        completed: true,
      },
      {
        date: "May 12, 2023",
        time: "10:20",
        status: "Shipped",
        location: "Chicago, IL",
        description: "Package has been shipped",
        completed: true,
      },
      {
        date: "May 11, 2023",
        time: "16:00",
        status: "Processing",
        location: "Chicago, IL",
        description: "Order is being processed",
        completed: true,
      },
    ],
  },
  "ORD-12346": {
    orderId: "ORD-12346",
    status: "Processing",
    estimatedDelivery: "May 25, 2023",
    trackingNumber: "TRK9876543211",
    carrier: "UPS",
    events: [
      {
        date: "May 1, 2023",
        time: "16:00",
        status: "Processing",
        location: "Chicago, IL",
        description: "Order is being processed",
        completed: true,
      },
    ],
  },
  "ORD-12347": {
    orderId: "ORD-12347",
    status: "Shipped",
    estimatedDelivery: "May 22, 2023",
    trackingNumber: "TRK9876543212",
    carrier: "USPS",
    events: [
      {
        date: "April 22, 2023",
        time: "10:20",
        status: "Shipped",
        location: "Chicago, IL",
        description: "Package has been shipped",
        completed: true,
      },
      {
        date: "April 21, 2023",
        time: "16:00",
        status: "Processing",
        location: "Chicago, IL",
        description: "Order is being processed",
        completed: true,
      },
    ],
  },
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const orderIdFromUrl = searchParams.get("id")

  const [orderId, setOrderId] = useState(orderIdFromUrl || "")
  const [trackingData, setTrackingData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (orderIdFromUrl) {
      handleTrackOrder()
    }
  }, [orderIdFromUrl])

  const handleTrackOrder = async (e) => {
    if (e) e.preventDefault()

    if (!orderId) {
      setError("Please enter an order number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const data = mockTrackingData[orderId]

      if (data) {
        setTrackingData(data)
      } else {
        setError("Order not found. Please check the order number and try again.")
      }
    } catch (error) {
      setError("Failed to track order. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="h-6 w-6" />
      case "Shipped":
        return <Truck className="h-6 w-6" />
      case "Delivered":
        return <Home className="h-6 w-6" />
      default:
        return <Circle className="h-6 w-6" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Out for Delivery":
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <ShopHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="orderId"
                    placeholder="e.g. ORD-12345"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Tracking..." : "Track"}
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            </form>
          </div>

          {trackingData && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">Order #{trackingData.orderId}</h2>
                      <Badge className={getStatusColor(trackingData.status)}>{trackingData.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Tracking Number: {trackingData.trackingNumber} ({trackingData.carrier})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="text-gray-500">Estimated Delivery:</span>{" "}
                      <span className="font-medium">{trackingData.estimatedDelivery}</span>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between mb-2">
                    {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((step, index) => (
                      <div key={step} className="flex flex-col items-center w-1/4">
                        <div
                          className={`rounded-full p-2 ${
                            trackingData.events.some((e) => e.status === step && e.completed)
                              ? "bg-primary/10 text-primary"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {getStatusIcon(step)}
                        </div>
                        <span className="text-xs mt-1 text-center">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold mb-4">Tracking History</h3>
                <div className="space-y-6">
                  {trackingData.events.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="relative">
                        <div
                          className={`rounded-full p-1 ${event.completed ? "bg-primary text-white" : "bg-gray-200"}`}
                        >
                          {event.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                        </div>
                        {index < trackingData.events.length - 1 && (
                          <div className="absolute top-7 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200 h-full"></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                          <span className="text-sm text-gray-500">
                            {event.date} at {event.time}
                          </span>
                        </div>
                        <p className="mt-1">{event.description}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Need help with your order?</p>
                  <Button variant="outline" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
