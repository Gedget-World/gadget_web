"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/context/admin-auth-context"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { loginAdmin } = useAdminAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify admin credentials
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, hardcoded credentials for different admin roles
      const adminCredentials = {
        "product@example.com": {
          id: "admin-1",
          name: "Product Manager",
          email: "product@example.com",
          role: "product-manager",
          password: "admin123",
        },
        "order@example.com": {
          id: "admin-2",
          name: "Order Manager",
          email: "order@example.com",
          role: "order-manager",
          password: "admin123",
        },
        "marketing@example.com": {
          id: "admin-3",
          name: "Marketing Manager",
          email: "marketing@example.com",
          role: "marketing-manager",
          password: "admin123",
        },
        "support@example.com": {
          id: "admin-4",
          name: "Customer Support",
          email: "support@example.com",
          role: "customer-support-manager",
          password: "admin123",
        },
        "analytics@example.com": {
          id: "admin-5",
          name: "Analytics Manager",
          email: "analytics@example.com",
          role: "analytics-manager",
          password: "admin123",
        },
      }

      const admin = adminCredentials[email]

      if (admin && admin.password === password) {
        // Login successful
        const { password, ...adminData } = admin
        loginAdmin(adminData)

        toast({
          title: "Success",
          description: `You have successfully logged in as ${admin.name}`,
        })

        router.push("/admin/dashboard")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-500 mt-2">Access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link href="/admin/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For demo purposes, use one of the following:</p>
            <div className="mt-2 space-y-1">
              <p>Email: product@example.com</p>
              <p>Email: order@example.com</p>
              <p>Email: marketing@example.com</p>
              <p>Email: support@example.com</p>
              <p>Email: analytics@example.com</p>
              <p className="mt-1">Password for all: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
