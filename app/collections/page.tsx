import Link from "next/link"
import Image from "next/image"
import ShopHeader from "@/components/shop-header"

// Mock collection data
const collections = [
  {
    id: 1,
    name: "Summer Collection",
    description: "Light and breathable pieces for the warm season",
    image: "/placeholder.svg?height=600&width=800",
    slug: "summer-collection",
    itemCount: 24,
  },
  {
    id: 2,
    name: "Winter Essentials",
    description: "Stay warm and stylish with our winter collection",
    image: "/placeholder.svg?height=600&width=800",
    slug: "winter-essentials",
    itemCount: 18,
  },
  {
    id: 3,
    name: "Casual Wear",
    description: "Everyday comfort without compromising on style",
    image: "/placeholder.svg?height=600&width=800",
    slug: "casual-wear",
    itemCount: 32,
  },
  {
    id: 4,
    name: "Formal Attire",
    description: "Make a statement with our elegant formal collection",
    image: "/placeholder.svg?height=600&width=800",
    slug: "formal-attire",
    itemCount: 15,
  },
  {
    id: 5,
    name: "Activewear",
    description: "Performance clothing for your active lifestyle",
    image: "/placeholder.svg?height=600&width=800",
    slug: "activewear",
    itemCount: 20,
  },
  {
    id: 6,
    name: "Accessories",
    description: "Complete your look with our stylish accessories",
    image: "/placeholder.svg?height=600&width=800",
    slug: "accessories",
    itemCount: 28,
  },
]

export default function CollectionsPage() {
  return (
    <>
      <ShopHeader />
      <main className="min-h-screen">
        {/* Hero Banner */}
        <div className="relative w-full h-[300px] bg-gray-900 text-white">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Collections"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Our Collections</h1>
            <p className="text-lg max-w-2xl">Explore our curated collections for every style and occasion</p>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{collection.name}</h2>
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{collection.itemCount} items</span>
                    <span className="text-primary font-medium group-hover:underline">Shop Now</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
