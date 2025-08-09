"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
import { useAdminAuth } from "@/context/admin-auth-context";

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { hasPermission } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for debouncing
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Slug check state
  const [slugCheckState, setSlugCheckState] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
  }>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });

  // Collections state
  const [collections, setCollections] = useState<
    Array<{ _id: string; name: string }>
  >([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);

  // Separate state for raw input strings
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");

  const [productData, setProductData] = useState({
    name: "",
    nameSlug: "",
    description: "",
    shortDescription: "",
    variants: [
      {
        color: "",
        size: "",
        price: "",
        originalPrice: "",
        stock: "",
        lowStockThreshold: "5",
        images: [] as string[],
        isActive: true,
      },
    ],
    tags: [] as string[],
    images: [] as string[], // Main product images
    rating: {
      average: 0,
      count: 0,
    },
    collection: "",
    isActive: true,
    isFeatured: false,
    seo: {
      title: "",
      description: "",
      keywords: [] as string[],
    },
  });

  // Constants
  const VALID_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const AVAILABLE_COLORS = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Orange", value: "#F97316" },
    { name: "Gray", value: "#6B7280" },
    { name: "Navy", value: "#1E3A8A" },
    { name: "Brown", value: "#92400E" },
    { name: "Teal", value: "#0D9488" },
    { name: "Indigo", value: "#4F46E5" },
    { name: "Rose", value: "#F43F5E" },
    { name: "Lime", value: "#65A30D" },
  ];

  // Fetch collections from API
  const fetchCollections = useCallback(async () => {
    try {
      setIsLoadingCollections(true);
      const response = await fetch(
        "http://localhost:5000/api/animeTribes/collections/name-id?isActive=true"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }

      const result = await response.json();

      console.log("Fetched collections:", result);

      if (result.success && Array.isArray(result.data)) {
        setCollections(result.data);
      } else {
        console.error("Invalid response format:", result);
        setCollections([]);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast({
        title: "Warning",
        description:
          "Failed to load collections. You can still create products without selecting a collection.",
        variant: "default",
      });
      setCollections([]);
    } finally {
      setIsLoadingCollections(false);
    }
  }, []);

  // Utility functions
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Slug checking function
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!slug.trim()) {
      setSlugCheckState({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
      return;
    }

    setSlugCheckState({
      isChecking: true,
      isAvailable: null,
      error: null,
    });

    try {
      const response = await fetch("/api/products/check-slug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        throw new Error("Failed to check slug availability");
      }

      const data = await response.json();

      setSlugCheckState({
        isChecking: false,
        isAvailable: !data.exists,
        error: null,
      });
    } catch (error) {
      console.error("Error checking slug:", error);
      setSlugCheckState({
        isChecking: false,
        isAvailable: null,
        error: "Failed to check slug availability",
      });
    }
  }, []);

  // Debounced function to check slug with delay
  const debouncedSlugCheck = useCallback(
    (slug: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        checkSlugAvailability(slug);
      }, 500); // 500ms delay
    },
    [checkSlugAvailability]
  );

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user has permission to manage products
    if (!hasPermission("manage_products")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add products",
        variant: "destructive",
      });
      router.push("/admin/dashboard");
      return;
    }

    console.log("Not working");
    // Fetch collections on page load
    fetchCollections();
  }, [hasPermission, router]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = "checked" in e.target ? e.target.checked : false;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProductData({
        ...productData,
        [parent]: {
          ...(productData as any)[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setProductData({
        ...productData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    // Auto-generate nameSlug when name changes
    if (name === "name") {
      const generatedSlug = generateSlug(value);
      setProductData((prev) => ({
        ...prev,
        name: value,
        nameSlug: generatedSlug,
      }));

      // Check slug availability with debouncing
      if (generatedSlug) {
        debouncedSlugCheck(generatedSlug);
      } else {
        setSlugCheckState({
          isChecking: false,
          isAvailable: null,
          error: null,
        });
      }
    }
  };

  // Handle manual slug change
  const handleSlugChange = (slug: string) => {
    setProductData({
      ...productData,
      nameSlug: slug,
    });

    // Check slug availability with debouncing
    if (slug.trim()) {
      debouncedSlugCheck(slug);
    } else {
      setSlugCheckState({
        isChecking: false,
        isAvailable: null,
        error: null,
      });
    }
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | boolean | string[]
  ) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setProductData({
      ...productData,
      variants: updatedVariants,
    });
  };

  const addVariant = () => {
    setProductData({
      ...productData,
      variants: [
        ...productData.variants,
        {
          color: "",
          size: "",
          price: "",
          originalPrice: "",
          stock: "",
          lowStockThreshold: "5",
          images: [] as string[],
          isActive: true,
        },
      ],
    });
  };

  const removeVariant = (index: number) => {
    if (productData.variants.length > 1) {
      const updatedVariants = productData.variants.filter(
        (_, i) => i !== index
      );
      setProductData({
        ...productData,
        variants: updatedVariants,
      });
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    // Process tags and update productData
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag);
    setProductData({
      ...productData,
      tags: tagsArray,
    });
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    // Process keywords and update productData
    const keywordsArray = value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword);
    setProductData({
      ...productData,
      seo: {
        ...productData.seo,
        keywords: keywordsArray,
      },
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!productData.name || !productData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (name, description)",
        variant: "destructive",
      });
      return;
    }

    // Check if slug is available before submitting
    if (slugCheckState.isAvailable === false) {
      toast({
        title: "Slug Conflict",
        description:
          "Please choose a different product name as this slug is already taken",
        variant: "destructive",
      });
      return;
    }

    // Check if we're still checking the slug
    if (slugCheckState.isChecking) {
      toast({
        title: "Please wait",
        description: "Still checking slug availability...",
        variant: "default",
      });
      return;
    }

    // Validate variants
    const hasValidVariant = productData.variants.some(
      (variant) =>
        variant.color &&
        variant.size &&
        variant.price &&
        variant.originalPrice &&
        variant.stock !== ""
    );

    if (!hasValidVariant) {
      toast({
        title: "Error",
        description:
          "Please add at least one complete variant with color, size, price, original price, and stock",
        variant: "destructive",
      });
      return;
    }

    // Validate that at least one image is provided (either main product images or variant images)
    const hasMainImages = productData.images.length > 0;
    const hasVariantImages = productData.variants.some(
      (variant) => variant.images.length > 0
    );

    if (!hasMainImages && !hasVariantImages) {
      toast({
        title: "Error",
        description:
          "Please add at least one product image (either main product images or variant images)",
        variant: "destructive",
      });
      return;
    }

    // Validate variant prices
    const invalidPrices = productData.variants.some(
      (variant) =>
        parseFloat(variant.price) < 0 ||
        parseFloat(variant.originalPrice) < 0 ||
        parseFloat(variant.price) > parseFloat(variant.originalPrice)
    );

    if (invalidPrices) {
      toast({
        title: "Error",
        description:
          "Price must be less than or equal to original price, and both must be positive",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Success",
        description: "Product has been created successfully",
      });

      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload for variant images
  const handleImageUpload = (
    variantIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `File ${file.name} is not a valid image type. Only JPEG, JPG, and PNG are allowed.`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `File ${file.name} is too large. Maximum size is 5MB.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Convert files to URLs (in a real app, you would upload to a server)
    const imageUrls: string[] = [];
    let processedFiles = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          imageUrls.push(e.target.result as string);
          processedFiles++;

          // Once all files are processed, update the variant
          if (processedFiles === validFiles.length) {
            const currentImages = productData.variants[variantIndex].images;
            handleVariantChange(variantIndex, "images", [
              ...currentImages,
              ...imageUrls,
            ]);

            toast({
              title: "Images uploaded",
              description: `Successfully uploaded ${validFiles.length} image(s)`,
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the input so the same files can be selected again if needed
    event.target.value = "";
  };

  // Handle file upload for main product images
  const handleMainImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `File ${file.name} is not a valid image type. Only JPEG, JPG, and PNG are allowed.`,
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxFileSize) {
        toast({
          title: "File too large",
          description: `File ${file.name} is too large. Maximum size is 5MB.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Convert files to URLs (in a real app, you would upload to a server)
    const imageUrls: string[] = [];
    let processedFiles = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          imageUrls.push(e.target.result as string);
          processedFiles++;

          // Once all files are processed, update the product images
          if (processedFiles === validFiles.length) {
            setProductData({
              ...productData,
              images: [...productData.images, ...imageUrls],
            });

            toast({
              title: "Images uploaded",
              description: `Successfully uploaded ${validFiles.length} image(s)`,
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the input so the same files can be selected again if needed
    event.target.value = "";
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Add New Product
            </h1>
            <p className="text-gray-500">
              Create a new product in your inventory
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameSlug">URL Slug</Label>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="nameSlug"
                            name="nameSlug"
                            value={productData.nameSlug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="auto-generated-from-name"
                            className={`pr-10 ${
                              slugCheckState.isAvailable === false
                                ? "border-red-500 focus:border-red-500"
                                : slugCheckState.isAvailable === true
                                ? "border-green-500 focus:border-green-500"
                                : ""
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {slugCheckState.isChecking && (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                            )}
                            {!slugCheckState.isChecking &&
                              slugCheckState.isAvailable === true && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            {!slugCheckState.isChecking &&
                              slugCheckState.isAvailable === false && (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                          </div>
                        </div>
                        {/* Status message */}
                        {slugCheckState.error && (
                          <p className="text-sm text-red-600">
                            {slugCheckState.error}
                          </p>
                        )}
                        {!slugCheckState.isChecking &&
                          !slugCheckState.error && (
                            <>
                              {slugCheckState.isAvailable === true && (
                                <p className="text-sm text-green-600">
                                  ✓ Slug is available
                                </p>
                              )}
                              {slugCheckState.isAvailable === false && (
                                <p className="text-sm text-red-600">
                                  ✗ Slug is already taken
                                </p>
                              )}
                            </>
                          )}
                        {!slugCheckState.error &&
                          slugCheckState.isAvailable === null &&
                          !slugCheckState.isChecking &&
                          productData.nameSlug && (
                            <p className="text-sm text-gray-500">
                              Auto-generated from product name
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={productData.description}
                      onChange={handleChange}
                      maxLength={2000}
                      placeholder="Detailed product description (max 2000 characters, ~300 words)"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      {productData.description.length}/2000 characters (~
                      {Math.ceil(productData.description.length / 6.5)} words)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      rows={3}
                      maxLength={200}
                      value={productData.shortDescription}
                      onChange={handleChange}
                      placeholder="Brief product summary (max 200 characters, ~30 words)"
                    />
                    <p className="text-xs text-gray-500">
                      {productData.shortDescription.length}/200 characters (~
                      {Math.ceil(
                        productData.shortDescription.length / 6.5
                      )}{" "}
                      words)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="collection">
                        Collection <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={productData.collection || undefined}
                        onValueChange={(value) =>
                          setProductData({
                            ...productData,
                            collection: value || "",
                          })
                        }
                        disabled={isLoadingCollections}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingCollections
                                ? "Loading collections..."
                                : "Select a collection"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCollections ? (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              Loading collections...
                            </div>
                          ) : collections.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              No collections available
                            </div>
                          ) : (
                            collections.map((collection) => (
                              <SelectItem
                                key={collection._id}
                                value={collection._id}
                              >
                                {collection.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {!isLoadingCollections && collections.length === 0 && (
                        <p className="text-xs text-gray-500">
                          No active collections found. You can create products
                          without a collection.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="Separate tags with commas"
                        value={tagsInput}
                        onChange={(e) => handleTagsChange(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Example: casual, summer, cotton
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        name="isActive"
                        checked={productData.isActive}
                        onCheckedChange={(checked) =>
                          setProductData({ ...productData, isActive: checked })
                        }
                      />
                      <Label htmlFor="isActive">Product is active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        name="isFeatured"
                        checked={productData.isFeatured}
                        onCheckedChange={(checked) =>
                          setProductData({
                            ...productData,
                            isFeatured: checked,
                          })
                        }
                      />
                      <Label htmlFor="isFeatured">Feature this product</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>
                    Manage different variations of your product (color, size,
                    etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {productData.variants.map((variant, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Variant {index + 1}</h4>
                        {productData.variants.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariant(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`variant-color-${index}`}>
                            Color <span className="text-red-500">*</span>
                          </Label>
                          <div className="space-y-3">
                            {/* Selected color display */}
                            {variant.color && (
                              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                                <div
                                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                                  style={{
                                    backgroundColor:
                                      AVAILABLE_COLORS.find(
                                        (c) => c.name === variant.color
                                      )?.value || "#000000",
                                  }}
                                />
                                <span className="text-sm font-medium">
                                  {variant.color}
                                </span>
                              </div>
                            )}

                            {/* Color picker grid */}
                            <div className="grid grid-cols-8 gap-2">
                              {AVAILABLE_COLORS.map((color) => (
                                <button
                                  key={color.name}
                                  type="button"
                                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                                    variant.color === color.name
                                      ? "border-gray-800 ring-2 ring-blue-500 ring-offset-1"
                                      : color.value === "#FFFFFF"
                                      ? "border-gray-300"
                                      : "border-gray-200"
                                  }`}
                                  style={{ backgroundColor: color.value }}
                                  onClick={() =>
                                    handleVariantChange(
                                      index,
                                      "color",
                                      color.name
                                    )
                                  }
                                  title={color.name}
                                />
                              ))}
                            </div>
                            {!variant.color && (
                              <p className="text-sm text-gray-500">
                                Select a color for this variant
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-size-${index}`}>
                            Size <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={variant.size}
                            onValueChange={(value) =>
                              handleVariantChange(index, "size", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {VALID_SIZES.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`variant-price-${index}`}>
                            Price <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`variant-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-originalPrice-${index}`}>
                            Original Price{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`variant-originalPrice-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.originalPrice}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "originalPrice",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-stock-${index}`}>
                            Stock <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`variant-stock-${index}`}
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-lowStockThreshold-${index}`}>
                            Low Stock Threshold
                          </Label>
                          <Input
                            id={`variant-lowStockThreshold-${index}`}
                            type="number"
                            min="0"
                            value={variant.lowStockThreshold}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "lowStockThreshold",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <Label>Variant Images</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {variant.images.map((image, imageIndex) => (
                            <div
                              key={imageIndex}
                              className="relative border rounded-lg p-2"
                            >
                              <img
                                src={image}
                                alt={`Variant ${index + 1} Image ${
                                  imageIndex + 1
                                }`}
                                className="w-full h-20 object-cover rounded"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0"
                                onClick={() => {
                                  const updatedImages = variant.images.filter(
                                    (_, i) => i !== imageIndex
                                  );
                                  handleVariantChange(
                                    index,
                                    "images",
                                    updatedImages
                                  );
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-20 hover:border-blue-400 transition-colors cursor-pointer relative">
                            <svg
                              className="h-8 w-8 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              multiple
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) => handleImageUpload(index, e)}
                              id={`variant-image-upload-${index}`}
                            />
                            <label
                              htmlFor={`variant-image-upload-${index}`}
                              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                            >
                              Choose Images
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG, JPEG, PNG (max 5MB each)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Switch
                          id={`variant-isActive-${index}`}
                          checked={variant.isActive}
                          onCheckedChange={(checked) =>
                            handleVariantChange(index, "isActive", checked)
                          }
                        />
                        <Label htmlFor={`variant-isActive-${index}`}>
                          Variant is active
                        </Label>
                      </div>

                      {/* File upload for variant images */}
                      <div className="mt-4">
                        <Label
                          htmlFor={`variant-upload-images-${index}`}
                          className="block text-sm font-medium"
                        >
                          Upload Variant Images
                        </Label>
                        <Input
                          id={`variant-upload-images-${index}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(index, e)}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500">
                          Recommended size: 800x800 pixels or larger
                        </p>
                      </div>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariant}
                    className="w-full"
                  >
                    Add Variant
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Overview</CardTitle>
                  <CardDescription>
                    Overall inventory settings and product rating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Product Rating</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rating-average" className="text-sm">
                            Average Rating
                          </Label>
                          <Input
                            id="rating-average"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={productData.rating.average}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                rating: {
                                  ...productData.rating,
                                  average: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            disabled
                          />
                        </div>
                        <div>
                          <Label htmlFor="rating-count" className="text-sm">
                            Review Count
                          </Label>
                          <Input
                            id="rating-count"
                            type="number"
                            min="0"
                            value={productData.rating.count}
                            onChange={(e) =>
                              setProductData({
                                ...productData,
                                rating: {
                                  ...productData.rating,
                                  count: parseInt(e.target.value) || 0,
                                },
                              })
                            }
                            disabled
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Rating will be calculated from customer reviews
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">
                          Total Stock Across All Variants
                        </Label>
                        <div className="text-2xl font-bold">
                          {productData.variants.reduce(
                            (total, variant) =>
                              total + (parseInt(variant.stock) || 0),
                            0
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Active Variants</Label>
                        <div className="text-2xl font-bold">
                          {
                            productData.variants.filter(
                              (variant) => variant.isActive
                            ).length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Upload images for your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Main Product Images
                      </Label>
                      <p className="text-sm text-gray-500">
                        These images will be shown on the product listing and
                        main product page
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {productData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border rounded-lg p-2"
                        >
                          <img
                            src={image}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 p-0"
                            onClick={() => {
                              const updatedImages = productData.images.filter(
                                (_, i) => i !== index
                              );
                              setProductData({
                                ...productData,
                                images: updatedImages,
                              });
                            }}
                          >
                            ×
                          </Button>
                          {index === 0 && (
                            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center h-32 hover:border-blue-400 transition-colors cursor-pointer relative">
                        <div className="text-gray-500">
                          <svg
                            className="mx-auto h-8 w-8"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-1 text-xs">Add Images</p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          multiple
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleMainImageUpload}
                          id="main-image-upload"
                        />
                        <label
                          htmlFor="main-image-upload"
                          className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium mt-2"
                        >
                          Choose Images
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, JPEG, PNG (max 5MB each)
                        </p>
                      </div>
                    </div>

                    {productData.images.length > 0 && (
                      <div className="text-sm text-gray-500">
                        <p>
                          • The first image will be used as the main product
                          image
                        </p>
                        <p>
                          • Drag images to reorder them (feature coming soon)
                        </p>
                        <p>• Recommended size: 800x800 pixels or larger</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                  <CardDescription>
                    Optimize your product for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="seo.title">Page Title</Label>
                    <Input
                      id="seo.title"
                      name="seo.title"
                      value={productData.seo.title}
                      onChange={handleChange}
                      placeholder={productData.name}
                    />
                    <p className="text-xs text-gray-500">
                      Leave blank to use product name
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo.description">Meta Description</Label>
                    <Textarea
                      id="seo.description"
                      name="seo.description"
                      rows={3}
                      maxLength={160}
                      value={productData.seo.description}
                      onChange={handleChange}
                      placeholder="SEO meta description (max 160 characters, ~25 words)"
                    />
                    <p className="text-xs text-gray-500">
                      {productData.seo.description.length}/160 characters (~
                      {Math.ceil(productData.seo.description.length / 6.5)}{" "}
                      words)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo.keywords">Meta Keywords</Label>
                    <Input
                      id="seo.keywords"
                      name="seo.keywords"
                      value={keywordsInput}
                      onChange={(e) => handleKeywordsChange(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-gray-500">
                      Separate keywords with commas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Preview Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Product Preview
                </CardTitle>
                <CardDescription>
                  Review your product details before creating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {productData.name || "Product Name"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {productData.nameSlug || "product-slug"}
                      </p>
                      {productData.shortDescription && (
                        <p className="text-sm mt-2">
                          {productData.shortDescription}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {productData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Collection:</span>
                        <span>
                          {productData.collection
                            ? collections.find(
                                (c) => c._id === productData.collection
                              )?.name || "Unknown Collection"
                            : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status:</span>
                        <div className="flex gap-2">
                          {productData.isActive && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Active
                            </span>
                          )}
                          {productData.isFeatured && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Variants:</span>
                        <span>
                          {
                            productData.variants.filter((v) => v.isActive)
                              .length
                          }{" "}
                          active of {productData.variants.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Stock:</span>
                        <span>
                          {productData.variants.reduce(
                            (total, variant) =>
                              total + (parseInt(variant.stock) || 0),
                            0
                          )}{" "}
                          units
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Product Images ({productData.images.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {productData.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt=""
                            className="w-full h-16 object-cover rounded border"
                          />
                        ))}
                        {productData.images.length > 4 && (
                          <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                            +{productData.images.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Variants</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {productData.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded"
                          >
                            <span>
                              {variant.color} - {variant.size}
                            </span>
                            <div className="flex gap-2 text-xs">
                              <span>${variant.price}</span>
                              <span className="text-gray-500">
                                Stock: {variant.stock}
                              </span>
                              {!variant.isActive && (
                                <span className="text-red-500">Inactive</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  slugCheckState.isChecking ||
                  slugCheckState.isAvailable === false
                }
              >
                {isSubmitting
                  ? "Creating..."
                  : slugCheckState.isChecking
                  ? "Checking..."
                  : "Create Product"}
              </Button>
            </div>
          </Tabs>
        </form>
      </div>
    </AdminLayout>
  );
}
