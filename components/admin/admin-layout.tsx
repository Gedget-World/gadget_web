"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/context/admin-auth-context"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isSuperAdmin } = useAdminAuth()

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (pathname.startsWith("/superadmin")) {
        router.push("/superadmin/login")
      } else if (pathname.startsWith("/admin")) {
        router.push("/admin/login")
      }
      return
    }

    // Redirect if trying to access wrong admin area
    if (isAuthenticated && pathname.startsWith("/superadmin") && !isSuperAdmin) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, isSuperAdmin, pathname, router])

  if (!isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader />
      <div className="md:pl-64 pt-16">
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
