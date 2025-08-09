"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopHeader from "@/components/shop-header";
import ProductCard from "@/components/product-card";
import { useEffect } from "react";
import { getApiCall } from "@/lib/utils";

// Mock featured collections
const featuredCollections = [
  {
    id: 1,
    name: "Summer Collection",
    image: "/placeholder.svg?height=600&width=800",
    slug: "summer-collection",
  },
  {
    id: 2,
    name: "Winter Essentials",
    image: "/placeholder.svg?height=600&width=800",
    slug: "winter-essentials",
  },
  {
    id: 3,
    name: "Casual Wear",
    image: "/placeholder.svg?height=600&width=800",
    slug: "casual-wear",
  },
];

// Mock featured products by category
const featuredCategories = [
  {
    id: 1,
    name: "Women's Fashion",
    products: [
      {
        id: 4,
        name: "Summer Floral Dress",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 9,
        name: "Elegant Blouse",
        price: 39.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 10,
        name: "High-Waisted Jeans",
        price: 54.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 11,
        name: "Casual Jumpsuit",
        price: 64.99,
        image: "/placeholder.svg?height=400&width=300",
      },
    ],
  },
  {
    id: 2,
    name: "Men's Fashion",
    products: [
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
        id: 5,
        name: "Striped Button-Up Shirt",
        price: 39.99,
        image: "/placeholder.svg?height=400&width=300",
      },
    ],
  },
  {
    id: 3,
    name: "Accessories",
    products: [
      {
        id: 12,
        name: "Leather Watch",
        price: 79.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 13,
        name: "Silver Necklace",
        price: 49.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 14,
        name: "Sunglasses",
        price: 34.99,
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 15,
        name: "Leather Belt",
        price: 29.99,
        image: "/placeholder.svg?height=400&width=300",
      },
    ],
  },
];

export default function Home() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Proceed with health check if env vars are loaded
        const healthData = await getApiCall("/health");
        console.log("Health API Response:", healthData);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    initializeApp();
  }, []);

  return (
    <main className="min-h-screen">
      <ShopHeader />

      {/* Hero Banner */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/placeholder.svg?height=1000&width=2000"
          alt="Fashion Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            New Season Arrivals
          </h1>
          <p className="text-xl max-w-2xl mb-8 text-white">
            Discover the latest trends and styles for the season
          </p>
          <Button size="lg" asChild>
            <Link href="/collections">Shop Collections</Link>
          </Button>
        </div>
      </div>

      {/* Featured Collections */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Collections</h2>
          <Link
            href="/collections"
            className="text-primary font-medium flex items-center hover:underline"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCollections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {collection.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products by Category */}
      {featuredCategories.map((category) => (
        <section key={category.id} className="container mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">{category.name}</h2>
            <Link
              href={`/collections/${category.name
                .toLowerCase()
                .replace("'s", "s")
                .replace(" ", "-")}`}
              className="text-primary font-medium flex items-center hover:underline"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            collections, special offers and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
