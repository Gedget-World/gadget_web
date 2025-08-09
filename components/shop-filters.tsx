"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ShopFilters() {
  const [priceRange, setPriceRange] = useState([0, 200])

  const categories = ["T-Shirts", "Shirts", "Jeans", "Trousers", "Dresses", "Jackets"]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  const colors = [
    { name: "Black", value: "bg-black" },
    { name: "White", value: "bg-white border" },
    { name: "Red", value: "bg-red-500" },
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
  ]

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={`category-${category}`} />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Price Range</h3>
        <Slider defaultValue={priceRange} max={200} step={1} onValueChange={setPriceRange} className="mb-2" />
        <div className="flex justify-between text-sm">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <Button key={size} variant="outline" className="h-9 w-9 p-0">
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Color</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <Button
              key={color.name}
              variant="outline"
              className={`h-9 w-9 p-0 ${color.value} rounded-full`}
              title={color.name}
            >
              <span className="sr-only">{color.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 shrink-0">
        <h2 className="text-xl font-semibold mb-6">Filters</h2>
        <FiltersContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden w-full mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            <FiltersContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
