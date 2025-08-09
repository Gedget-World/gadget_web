"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlusCircle, Edit, Trash2, Search, Eye } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/admin-layout"

// Mock collections data
const mockCollections = [
  {
    id: 1,
    name: "Summer Collection",
    description: "Light and breathable pieces for the warm season",
    image: "/placeholder.svg?height=80&width=80",
    slug: "summer-collection",
    status: "active",
    itemCount: 24,
    createdAt: "2023-04-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Winter Essentials",
    description: "Stay warm and stylish with our winter collection",
    image: "/placeholder.svg?height=80&width=80",
    slug: "winter-essentials",
    status: "active",
    itemCount: 18,
    createdAt: "2023-03-20T14:45:00Z",
  },
  {
    id: 3,
    name: "Casual Wear",
    description: "Everyday comfort without compromising on style",
    image: "/placeholder.svg?height=80&width=80",
    slug: "casual-wear",
    status: "active",
    itemCount: 32,
    createdAt: "2023-02-10T09:15:00Z",
  },
  {
    id: 4,
    name: "Formal Attire",
    description: "Make a statement with our elegant formal collection",
    image: "/placeholder.svg?height=80&width=80",
    slug: "formal-attire",
    status: "draft",
    itemCount: 15,
    createdAt: "2023-05-05T16:20:00Z",
  },
  {
    id: 5,
    name: "Activewear",
    description: "Performance clothing for your active lifestyle",
    image: "/placeholder.svg?height=80&width=80",
    slug: "activewear",
    status: "active",
    itemCount: 20,
    createdAt: "2023-01-12T11:10:00Z",
  },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState(mockCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    slug: "",
    status: "draft",
    image: "/placeholder.svg?height=80&width=80",
  })

  const { toast } = useToast()

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCollection = () => {
    if (!newCollection.name || !newCollection.slug) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call
    const newCollectionItem = {
      id: collections.length + 1,
      ...newCollection,
      itemCount: 0,
      createdAt: new Date().toISOString(),
    }

    setCollections([...collections, newCollectionItem])
    setIsAddDialogOpen(false)
    setNewCollection({
      name: "",
      description: "",
      slug: "",
      status: "draft",
      image: "/placeholder.svg?height=80&width=80",
    })

    toast({
      title: "Success",
      description: "Collection has been added successfully",
    })
  }

  const handleDeleteCollection = () => {
    if (!selectedCollection) return

    // In a real app, this would be an API call
    setCollections(collections.filter((collection) => collection.id !== selectedCollection.id))
    setIsDeleteDialogOpen(false)
    setSelectedCollection(null)

    toast({
      title: "Success",
      description: "Collection has been deleted successfully",
    })
  }

  const getStatusBadgeColor = (status) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-gray-500">Manage product collections</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Collection</DialogTitle>
                <DialogDescription>Create a new product collection to organize your products.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setNewCollection({
                        ...newCollection,
                        name,
                        slug: generateSlug(name),
                      })
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="slug"
                    value={newCollection.slug}
                    onChange={(e) => setNewCollection({ ...newCollection, slug: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newCollection.description}
                    onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={newCollection.status}
                    onChange={(e) => setNewCollection({ ...newCollection, status: e.target.value })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="image" className="text-right pt-2">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                        <Image
                          src={newCollection.image || "/placeholder.svg"}
                          alt="Collection preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        Upload Image
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Recommended size: 800x600px. Max file size: 2MB.</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddCollection}>
                  Add Collection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search collections..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No collections found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image
                          src={collection.image || "/placeholder.svg"}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{collection.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{collection.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{collection.itemCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(collection.status)}>{collection.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(collection.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/collections/${collection.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/superadmin/collections/${collection.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedCollection(collection)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the collection "{selectedCollection?.name}"? This action
                                cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteCollection}>
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
