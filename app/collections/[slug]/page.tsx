"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ShopHeader from "@/components/shop-header"
import ProductCard from "@/components/product-card"
import ShopFilters from "@/components/shop-filters"

// Mock collection data
const collections = {
  "summer-collection": {
    id: 1,
    name: "Summer Collection",
    description: "Light and breathable pieces for the warm season",
    image: "/placeholder.svg?height=600&width=1200",
  },
  "winter-essentials": {
    id: 2,
    name: "Winter Essentials",
    description: "Stay warm and stylish with our winter collection",
    image: "/placeholder.svg?height=600&width=1200",
  },
  "casual-wear": {
    id: 3,
    name: "Casual Wear",
    description: "Everyday comfort without compromising on style",
    image: "/placeholder.svg?height=600&width=1200",
  },
  "formal-attire": {
    id: 4,
    name: "Formal Attire",
    description: "Make a statement with our elegant formal collection",
    image: "/placeholder.svg?height=600&width=1200",
  },
  activewear: {
    id: 5,
    name: "Activewear",
    description: "Performance clothing for your active lifestyle",
    image: "/placeholder.svg?height=600&width=1200",
  },
  accessories: {
    id: 6,
    name: "Accessories",
    description: "Complete your look with our stylish accessories",
    image: "/placeholder.svg?height=600&width=1200",
  },
}

// Mock products data
const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 3,
    name: "Casual Denim Jacket",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    name: "Summer Floral Dress",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    name: "Striped Button-Up Shirt",
    price: 39.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    name: "Casual Chino Pants",
    price: 45.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 7,
    name: "Knit Sweater",
    price: 65.99,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 8,
    name: "Leather Bomber Jacket",
    price: 129.99,
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function CollectionPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [collection, setCollection] = useState(null)
  const [sortOption, setSortOption] = useState("featured")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      // In a real app, this would be an API call
      const collectionData = collections[slug]
      setCollection(collectionData)
      setLoading(false)
    }
  }, [slug])

  if (loading) {
    return (
      <>
        <ShopHeader />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </>
    )
  }

  if (!collection) {
    return (
      <>
        <ShopHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
          <p>The collection you're looking for doesn't exist.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <ShopHeader />
      <main className="min-h-screen">
        {/* Collection Banner */}
        <div className="relative w-full h-[300px]">
          <Image
            src={collection.image || "/placeholder.svg"}
            alt={collection.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{collection.name}</h1>
            <p className="text-lg max-w-2xl text-white">{collection.description}</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <ShopFilters />

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{products.length} products</p>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
