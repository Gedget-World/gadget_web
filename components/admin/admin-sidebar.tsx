"use client"

import type React from "react"
import type { Permission } from "@/context/admin-auth-context"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  ClipboardList,
  Star,
  Tag,
  Settings,
  BarChart,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Percent,
  ImageIcon,
  Mail,
  Activity,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAdminAuth } from "@/context/admin-auth-context"

type SidebarItem = {
  name: string
  href: string
  icon: React.ElementType
  permission?: Permission
  children?: Omit<SidebarItem, "children">[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const { adminUser, isSuperAdmin, logoutAdmin, hasPermission } = useAdminAuth()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const routePrefix = isSuperAdmin ? "/superadmin" : "/admin"

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: `${routePrefix}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "User Management",
      href: "#",
      icon: Users,
      permission: "manage_admins",
      children: [
        {
          name: "Admin Users",
          href: `${routePrefix}/users/admins`,
          icon: Users,
          permission: "manage_admins",
        },
        {
          name: "Roles & Permissions",
          href: `${routePrefix}/users/roles`,
          icon: Users,
          permission: "manage_roles",
        },
        {
          name: "Customers",
          href: `${routePrefix}/users/customers`,
          icon: Users,
          permission: "view_customers",
        },
      ],
    },
    {
      name: "Products",
      href: "#",
      icon: ShoppingBag,
      permission: "view_products",
      children: [
        {
          name: "All Products",
          href: `${routePrefix}/products`,
          icon: ShoppingBag,
          permission: "view_products",
        },
        {
          name: "Categories",
          href: `${routePrefix}/products/categories`,
          icon: Package,
          permission: "manage_categories",
        },
        {
          name: "Collections",
          href: `${routePrefix}/collections`,
          icon: Package,
          permission: "manage_categories",
        },
        {
          name: "Attributes",
          href: `${routePrefix}/products/attributes`,
          icon: Tag,
          permission: "manage_attributes",
        },
        {
          name: "Inventory",
          href: `${routePrefix}/products/inventory`,
          icon: Package,
          permission: "manage_inventory",
        },
      ],
    },
    {
      name: "Orders",
      href: `${routePrefix}/orders`,
      icon: ClipboardList,
      permission: "view_orders",
    },
    {
      name: "Marketing",
      href: "#",
      icon: Percent,
      permission: "manage_promotions",
      children: [
        {
          name: "Promotions & Discounts",
          href: `${routePrefix}/marketing/promotions`,
          icon: Percent,
          permission: "manage_promotions",
        },
        {
          name: "Banners & Sliders",
          href: `${routePrefix}/marketing/banners`,
          icon: ImageIcon,
          permission: "manage_banners",
        },
        {
          name: "Email Campaigns",
          href: `${routePrefix}/marketing/email`,
          icon: Mail,
          permission: "manage_marketing_campaigns",
        },
      ],
    },
    {
      name: "Customer Support",
      href: "#",
      icon: MessageSquare,
      permission: "view_support_tickets",
      children: [
        {
          name: "Support Tickets",
          href: `${routePrefix}/support/tickets`,
          icon: MessageSquare,
          permission: "view_support_tickets",
        },
        {
          name: "Reviews",
          href: `${routePrefix}/reviews`,
          icon: Star,
          permission: "manage_reviews",
        },
      ],
    },
    {
      name: "Analytics",
      href: "#",
      icon: BarChart,
      permission: "view_analytics",
      children: [
        {
          name: "Dashboard",
          href: `${routePrefix}/analytics/dashboard`,
          icon: Activity,
          permission: "view_analytics",
        },
        {
          name: "Reports",
          href: `${routePrefix}/analytics/reports`,
          icon: FileText,
          permission: "export_reports",
        },
      ],
    },
    {
      name: "Settings",
      href: "#",
      icon: Settings,
      permission: "manage_settings",
      children: [
        {
          name: "General",
          href: `${routePrefix}/settings/general`,
          icon: Settings,
          permission: "manage_settings",
        },
        {
          name: "Shipping",
          href: `${routePrefix}/settings/shipping`,
          icon: Package,
          permission: "manage_shipping_methods",
        },
        {
          name: "Payment",
          href: `${routePrefix}/settings/payment`,
          icon: ShoppingBag,
          permission: "manage_payment_methods",
        },
        {
          name: "Email Templates",
          href: `${routePrefix}/settings/email`,
          icon: Mail,
          permission: "manage_settings",
        },
      ],
    },
    {
      name: "Activity Logs",
      href: `${routePrefix}/activity-logs`,
      icon: Activity,
      permission: "view_activity_logs",
    },
  ]

  const filteredItems = sidebarItems
    .filter((item) => {
      if (!item.permission) return true
      return isSuperAdmin || hasPermission(item.permission)
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(
            (child) => !child.permission || isSuperAdmin || hasPermission(child.permission),
          ),
        }
      }
      return item
    })

  const SidebarContent = () => (
    <div className="space-y-1">
      <div className="px-3 py-2">
        <div className="mb-2 px-4 py-3">
          <h2 className="text-lg font-semibold">
            {isSuperAdmin ? "Super Admin" : adminUser?.customRoleName || adminUser?.role}
          </h2>
          <p className="text-sm text-gray-500">{adminUser?.name}</p>
        </div>

        <nav className="space-y-1">
          {filteredItems.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center w-full px-4 py-2 text-sm rounded-md group ${
                      isActive(item.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openMenus[item.name] ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openMenus[item.name] && (
                    <div className="pl-10 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center px-4 py-2 text-sm rounded-md ${
                            isActive(child.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  isActive(item.href) ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-3 py-2 border-t">
        <button
          onClick={logoutAdmin}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
