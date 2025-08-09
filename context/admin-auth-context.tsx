"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define specific admin role types
export type AdminRoleType =
  | "super-admin"
  | "product-manager"
  | "order-manager"
  | "marketing-manager"
  | "customer-support-manager"
  | "analytics-manager"
  | "custom"

// Define permission types
export type Permission =
  // Product related permissions
  | "view_products"
  | "manage_products"
  | "manage_categories"
  | "manage_inventory"
  | "manage_attributes"

  // Order related permissions
  | "view_orders"
  | "manage_orders"
  | "process_refunds"
  | "view_customers"

  // Marketing related permissions
  | "manage_promotions"
  | "manage_banners"
  | "manage_marketing_campaigns"

  // Customer support related permissions
  | "view_support_tickets"
  | "manage_support_tickets"
  | "manage_reviews"

  // Analytics related permissions
  | "view_analytics"
  | "export_reports"

  // Admin management permissions
  | "manage_admins"
  | "manage_roles"
  | "view_activity_logs"

  // Settings permissions
  | "manage_settings"
  | "manage_payment_methods"
  | "manage_shipping_methods"

// Define role configuration with default permissions
export const DEFAULT_ROLE_PERMISSIONS: Record<AdminRoleType, Permission[]> = {
  "super-admin": [
    "view_products",
    "manage_products",
    "manage_categories",
    "manage_inventory",
    "manage_attributes",
    "view_orders",
    "manage_orders",
    "process_refunds",
    "view_customers",
    "manage_promotions",
    "manage_banners",
    "manage_marketing_campaigns",
    "view_support_tickets",
    "manage_support_tickets",
    "manage_reviews",
    "view_analytics",
    "export_reports",
    "manage_admins",
    "manage_roles",
    "view_activity_logs",
    "manage_settings",
    "manage_payment_methods",
    "manage_shipping_methods",
  ],
  "product-manager": ["view_products", "manage_products", "manage_categories", "manage_inventory", "manage_attributes"],
  "order-manager": ["view_orders", "manage_orders", "process_refunds", "view_customers"],
  "marketing-manager": ["manage_promotions", "manage_banners", "manage_marketing_campaigns"],
  "customer-support-manager": ["view_support_tickets", "manage_support_tickets", "manage_reviews", "view_customers"],
  "analytics-manager": ["view_analytics", "export_reports"],
  custom: [], // Custom role with no default permissions
}

export const ROLE_DISPLAY_NAMES: Record<AdminRoleType, string> = {
  "super-admin": "Super Admin",
  "product-manager": "Product Manager",
  "order-manager": "Order Manager",
  "marketing-manager": "Marketing Manager",
  "customer-support-manager": "Customer Support Manager",
  "analytics-manager": "Analytics Manager",
  custom: "Custom Role",
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRoleType
  permissions: Permission[]
  customRoleName?: string
}

type AdminAuthContextType = {
  adminUser: AdminUser | null
  isAuthenticated: boolean
  isSuperAdmin: boolean
  loginSuperAdmin: (user: AdminUser) => void
  loginAdmin: (user: AdminUser) => void
  logoutAdmin: () => void
  hasPermission: (permission: Permission) => boolean
  getRoleName: (role: AdminRoleType, customName?: string) => string
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  // Load admin user from localStorage on initial render
  useEffect(() => {
    const savedAdminUser = localStorage.getItem("adminUser")
    if (savedAdminUser) {
      try {
        const parsedUser = JSON.parse(savedAdminUser)
        setAdminUser(parsedUser)
        setIsAuthenticated(true)
        setIsSuperAdmin(parsedUser.role === "super-admin")
      } catch (error) {
        console.error("Failed to parse admin user from localStorage:", error)
      }
    }
  }, [])

  const loginSuperAdmin = (userData: AdminUser) => {
    if (userData.role !== "super-admin") {
      throw new Error("User is not a super admin")
    }

    // Ensure super admin has all permissions
    const userWithAllPermissions = {
      ...userData,
      permissions: DEFAULT_ROLE_PERMISSIONS["super-admin"],
    }

    setAdminUser(userWithAllPermissions)
    setIsAuthenticated(true)
    setIsSuperAdmin(true)
    localStorage.setItem("adminUser", JSON.stringify(userWithAllPermissions))
  }

  const loginAdmin = (userData: AdminUser) => {
    // If no permissions are provided, use the default permissions for the role
    const userWithPermissions = {
      ...userData,
      permissions: userData.permissions?.length ? userData.permissions : DEFAULT_ROLE_PERMISSIONS[userData.role] || [],
    }

    setAdminUser(userWithPermissions)
    setIsAuthenticated(true)
    setIsSuperAdmin(userData.role === "super-admin")
    localStorage.setItem("adminUser", JSON.stringify(userWithPermissions))
  }

  const logoutAdmin = () => {
    setAdminUser(null)
    setIsAuthenticated(false)
    setIsSuperAdmin(false)
    localStorage.removeItem("adminUser")
  }

  const hasPermission = (permission: Permission) => {
    if (!adminUser) return false
    if (adminUser.role === "super-admin") return true
    return adminUser.permissions?.includes(permission) || false
  }

  const getRoleName = (role: AdminRoleType, customName?: string) => {
    if (role === "custom" && customName) {
      return customName
    }
    return ROLE_DISPLAY_NAMES[role] || role
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        isSuperAdmin,
        loginSuperAdmin,
        loginAdmin,
        logoutAdmin,
        hasPermission,
        getRoleName,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
