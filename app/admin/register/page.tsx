"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAdminAuth } from "@/context/admin-auth-context"

export default function AdminRegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { loginAdmin } = useAdminAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword || !inviteCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify invite code and register admin
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, hardcoded invite codes for different admin roles
      const inviteCodes = {
        PRODUCT123: {
          role: "product-manager",
          permissions: [
            "view_products",
            "manage_products",
            "manage_categories",
            "manage_inventory",
            "manage_attributes",
          ],
        },
        ORDER123: {
          role: "order-manager",
          permissions: ["view_orders", "manage_orders", "process_refunds", "view_customers"],
        },
        MARKETING123: {
          role: "marketing-manager",
          permissions: ["manage_promotions", "manage_banners", "manage_marketing_campaigns"],
        },
        SUPPORT123: {
          role: "customer-support-manager",
          permissions: ["view_support_tickets", "manage_support_tickets", "manage_reviews", "view_customers"],
        },
        ANALYTICS123: {
          role: "analytics-manager",
          permissions: ["view_analytics", "export_reports"],
        },
      }

      const roleInfo = inviteCodes[inviteCode]

      if (roleInfo) {
        // Registration successful
        const adminId = `admin-${Date.now()}`

        loginAdmin({
          id: adminId,
          name: name,
          email: email,
          role: roleInfo.role,
          permissions: roleInfo.permissions,
        })

        toast({
          title: "Success",
          description: "Your admin account has been created successfully",
        })

        router.push("/admin/dashboard")
      } else {
        throw new Error("Invalid invite code")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
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
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Admin Registration</h1>
            <p className="text-gray-500 mt-2">Create your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Enter your invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>
              Already have an account?{" "}
              <Link href="/admin/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For demo purposes, use one of the following invite codes:</p>
            <div className="mt-2 space-y-1">
              <p>PRODUCT123 - Product Manager</p>
              <p>ORDER123 - Order Manager</p>
              <p>MARKETING123 - Marketing Manager</p>
              <p>SUPPORT123 - Customer Support Manager</p>
              <p>ANALYTICS123 - Analytics Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
