"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/admin-layout"
import { useAdminAuth } from "@/context/admin-auth-context"

// Mock promotions data
const mockPromotions = [
  {
    id: "1",
    name: "Summer Sale",
    code: "SUMMER2023",
    type: "percentage",
    value: 20,
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-06-30T23:59:59Z",
    status: "active",
    usageLimit: 1000,
    usageCount: 245,
  },
  {
    id: "2",
    name: "Welcome Discount",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "active",
    usageLimit: null,
    usageCount: 1245,
  },
  {
    id: "3",
    name: "Free Shipping",
    code: "FREESHIP",
    type: "fixed_shipping",
    value: 0,
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2023-05-31T23:59:59Z",
    status: "expired",
    usageLimit: 500,
    usageCount: 487,
  },
  {
    id: "4",
    name: "Flash Sale",
    code: "FLASH25",
    type: "percentage",
    value: 25,
    startDate: "2023-07-15T00:00:00Z",
    endDate: "2023-07-16T23:59:59Z",
    status: "scheduled",
    usageLimit: 200,
    usageCount: 0,
  },
  {
    id: "5",
    name: "$10 Off",
    code: "10OFF",
    type: "fixed_amount",
    value: 10,
    startDate: "2023-04-01T00:00:00Z",
    endDate: "2023-04-30T23:59:59Z",
    status: "expired",
    usageLimit: 300,
    usageCount: 278,
  },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(mockPromotions)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const { toast } = useToast()
  const { hasPermission } = useAdminAuth()
  const canManagePromotions = hasPermission("manage_promotions")

  const filteredPromotions = promotions.filter(
    (promotion) =>
      (promotion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || promotion.status === statusFilter),
  )

  const handleDeletePromotion = () => {
    if (!selectedPromotion) return

    // In a real app, this would be an API call
    setPromotions(promotions.filter((promotion) => promotion.id !== selectedPromotion.id))
    setIsDeleteDialogOpen(false)
    setSelectedPromotion(null)

    toast({
      title: "Success",
      description: "Promotion has been deleted successfully",
    })
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      case "disabled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatDiscountValue = (type, value) => {
    switch (type) {
      case "percentage":
        return `${value}%`
      case "fixed_amount":
        return `$${value}`
      case "fixed_shipping":
        return "Free Shipping"
      default:
        return value
    }
  }

  const statuses = ["all", "active", "scheduled", "expired", "disabled"]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promotions & Discounts</h1>
            <p className="text-gray-500">Manage promotional offers and discount codes</p>
          </div>
          {canManagePromotions && (
            <Button asChild>
              <Link href="/admin/marketing/promotions/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Promotion
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or code..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No promotions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{promotion.code}</code>
                    </TableCell>
                    <TableCell>{formatDiscountValue(promotion.type, promotion.value)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span>
                          {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {promotion.usageCount} / {promotion.usageLimit ? promotion.usageLimit : "∞"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(promotion.status)}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canManagePromotions && (
                          <>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/admin/marketing/promotions/${promotion.id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedPromotion(promotion)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete the promotion "{selectedPromotion?.name}"? This
                                    action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeletePromotion}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}
