"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "@/components/product-card"

// Mock product data
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

export default function ProductGrid() {
  const [sortOption, setSortOption] = useState("featured")

  return (
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
  )
}
