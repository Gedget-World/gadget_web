"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/context/cart-context"
import ShopHeader from "@/components/shop-header"
import ProductCard from "@/components/product-card"

// Mock product data - in a real app this would come from an API
const getProductById = (id) => {
  const products = [
    {
      id: 1,
      name: "Classic White T-Shirt",
      price: 29.99,
      description:
        "A timeless classic white t-shirt made from 100% organic cotton. Soft, comfortable, and perfect for everyday wear.",
      details: "100% Organic Cotton\nMachine washable\nRegular fit\nRound neck\nShort sleeves",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Black", "Gray"],
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      ratings: [
        { id: 1, user: "Alex", rating: 5, comment: "Great quality and fit. Highly recommend!", date: "2023-05-15" },
        { id: 2, user: "Jamie", rating: 4, comment: "Nice material, but runs a bit large.", date: "2023-05-10" },
        { id: 3, user: "Taylor", rating: 5, comment: "Perfect basic tee. Will buy more colors!", date: "2023-05-05" },
        { id: 4, user: "Jordan", rating: 4, comment: "Good quality for the price.", date: "2023-04-28" },
        { id: 5, user: "Casey", rating: 5, comment: "Excellent fabric and stitching.", date: "2023-04-20" },
      ],
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      price: 59.99,
      description: "Modern slim fit jeans with a comfortable stretch. Perfect for casual and semi-formal occasions.",
      details: "98% Cotton, 2% Elastane\nMachine washable\nSlim fit\nFive pockets\nButton and zip fastening",
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Blue", "Black", "Gray"],
      images: [
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
        "/placeholder.svg?height=600&width=500",
      ],
      ratings: [
        { id: 1, user: "Morgan", rating: 5, comment: "Perfect fit and very comfortable!", date: "2023-05-12" },
        {
          id: 2,
          user: "Riley",
          rating: 4,
          comment: "Good quality denim, slight shrinkage after wash.",
          date: "2023-05-08",
        },
        { id: 3, user: "Quinn", rating: 5, comment: "Love these jeans! Will buy another pair.", date: "2023-05-01" },
        { id: 4, user: "Avery", rating: 3, comment: "Nice style but a bit tight in the waist.", date: "2023-04-25" },
        { id: 5, user: "Blake", rating: 4, comment: "Great everyday jeans.", date: "2023-04-18" },
      ],
    },
  ]

  return products.find((p) => p.id === Number.parseInt(id)) || null
}

// Mock recommended products
const recommendedProducts = [
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
]

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [userReviewName, setUserReviewName] = useState("")

  useEffect(() => {
    if (params.id) {
      // In a real app, this would be an API call
      const productData = getProductById(params.id)
      setProduct(productData)
      if (productData) {
        setSelectedSize(productData.sizes[0])
        setSelectedColor(productData.colors[0])
      }
      setLoading(false)
    }
  }, [params.id])

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select a size and color before adding to cart",
        variant: "destructive",
      })
      return
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()

    if (!userRating || !userComment || !userReviewName) {
      toast({
        title: "Please complete the form",
        description: "Please provide a rating, comment, and your name",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would be an API call to save the review
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    })

    // Reset form
    setUserRating(0)
    setUserComment("")
    setUserReviewName("")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <>
      <ShopHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Product Details Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
                    currentImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>

            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <=
                    Math.round(product.ratings.reduce((acc, curr) => acc + curr.rating, 0) / product.ratings.length)
                      ? "fill-primary text-primary"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{product.ratings.length} reviews</span>
            </div>

            <p className="mb-6">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Size</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <div key={size} className="flex items-center">
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-background 
                      text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary 
                      peer-data-[state=checked]:text-primary"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color</h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color} className="flex items-center">
                    <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex h-10 px-3 cursor-pointer items-center justify-center rounded-md border border-muted bg-background 
                      text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary 
                      peer-data-[state=checked]:text-primary"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full mb-6" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            {/* Product Details Tabs */}
            <Tabs defaultValue="details" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="whitespace-pre-line">{product.details}</div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4">
                <p>Free standard shipping on all orders over $50. Delivery typically takes 3-5 business days.</p>
                <p className="mt-2">Express shipping available at checkout for $12.99.</p>
              </TabsContent>
              <TabsContent value="returns" className="mt-4">
                <p>We offer a 30-day return policy for unworn items in original packaging.</p>
                <p className="mt-2">Please see our full return policy for more details.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

          {/* Review Form */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <Label htmlFor="name" className="block mb-2">
                  Your Name
                </Label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={userReviewName}
                  onChange={(e) => setUserReviewName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <Label className="block mb-2">Your Rating</Label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setUserRating(star)} className="mr-1">
                      <Star
                        className={`w-6 h-6 ${star <= userRating ? "fill-primary text-primary" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="comment" className="block mb-2">
                  Your Review
                </Label>
                <Textarea id="comment" rows={4} value={userComment} onChange={(e) => setUserComment(e.target.value)} />
              </div>

              <Button type="submit">Submit Review</Button>
            </form>
          </div>

          {/* Top 5 Reviews */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Reviews</h3>
            {product.ratings.map((rating) => (
              <div key={rating.id} className="border-b pb-4 mb-4 last:border-0">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating.rating ? "fill-primary text-primary" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{rating.user}</span>
                  <span className="text-gray-500 text-sm ml-auto">{rating.date}</span>
                </div>
                <p>{rating.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
