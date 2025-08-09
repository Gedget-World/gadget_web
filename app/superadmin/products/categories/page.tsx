"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
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

// Mock categories data
const mockCategories = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and accessories",
    productsCount: 120,
    status: "active",
    featured: true,
    createdAt: "2022-01-10T08:15:00Z",
  },
  {
    id: "cat-2",
    name: "Clothing",
    slug: "clothing",
    description: "Apparel and fashion items",
    productsCount: 250,
    status: "active",
    featured: true,
    createdAt: "2022-01-15T09:30:00Z",
  },
  {
    id: "cat-3",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Home decor and kitchen appliances",
    productsCount: 180,
    status: "active",
    featured: false,
    createdAt: "2022-02-05T10:45:00Z",
  },
  {
    id: "cat-4",
    name: "Books",
    slug: "books",
    description: "Books, e-books, and audiobooks",
    productsCount: 320,
    status: "active",
    featured: false,
    createdAt: "2022-02-10T11:20:00Z",
  },
  {
    id: "cat-5",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sporting goods and outdoor equipment",
    productsCount: 150,
    status: "active",
    featured: true,
    createdAt: "2022-03-01T12:10:00Z",
  },
  {
    id: "cat-6",
    name: "Toys & Games",
    slug: "toys-games",
    description: "Toys, games, and entertainment items",
    productsCount: 90,
    status: "inactive",
    featured: false,
    createdAt: "2022-03-15T13:25:00Z",
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const { toast } = useToast()
  const { hasPermission } = useAdminAuth()
  const canManageCategories = hasPermission("manage_categories")

  const filteredCategories = categories.filter(
    (category) =>
      (category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || category.status === statusFilter),
  )

  const handleDeleteCategory = () => {
    if (!selectedCategory) return

    // In a real app, this would be an API call
    setCategories(categories.filter((category) => category.id !== selectedCategory.id))
    setIsDeleteDialogOpen(false)
    setSelectedCategory(null)

    toast({
      title: "Success",
      description: "Category has been deleted successfully",
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const statuses = ["all", "active", "inactive"]

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
            <p className="text-gray-500">Manage product categories and organization</p>
          </div>
          {canManageCategories && (
            <Button asChild>
              <Link href="/superadmin/products/categories/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search categories..."
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
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>{category.productsCount}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          category.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {category.featured ? (
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canManageCategories && (
                          <>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/superadmin/products/categories/${category.id}`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(category)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete the category "{selectedCategory?.name}"? This action
                                    cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={handleDeleteCategory}>
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
