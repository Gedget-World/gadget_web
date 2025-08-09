"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  Eye,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
import { useAdminAuth } from "@/context/admin-auth-context";
import { useRouter } from "next/navigation";

// Type definitions
type CollectionStatus = "active" | "draft";

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
  status: CollectionStatus;
  itemCount: number;
  createdAt: string;
}

// Mock collections data
const mockCollections: Collection[] = [
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
];

export default function CollectionsPage() {
  const router = useRouter();
  const { hasPermission, adminUser } = useAdminAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    slug: "",
    status: "draft" as CollectionStatus,
    image: "",
    isFeatured: false,
    sortOrder: 1,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    animeStudio: "",
    genre: ["Anime"],
    releaseYear: new Date().getFullYear(),
    popularity: "medium" as "low" | "medium" | "high",
    season: "all_seasons",
    isLimited: false,
    eventType: "regular",
    productCategory: "apparel",
    clothingType: ["t-shirts", "hoodies"],
    quality: "premium" as "basic" | "premium" | "luxury",
    itemTypes: ["clothing", "accessories"],
    itemType: "merchandise",
    isCollectible: true,
    isClassic: false,
    isModern: true,
    hasClassics: false,
  });
  const [slugCheckState, setSlugCheckState] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    error: string | null;
  }>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });
  const [imageUploadState, setImageUploadState] = useState<{
    isUploading: boolean;
    error: string | null;
  }>({
    isUploading: false,
    error: null,
  });
  const [isCreating, setIsCreating] = useState(false);

  const { toast } = useToast();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check if user has permission to manage collections
  if (
    adminUser &&
    !hasPermission("manage_categories") &&
    adminUser.role !== "product-manager"
  ) {
    router.push("/admin/dashboard");
    return null;
  }

  // Fetch collections data from API
  const fetchCollections = useCallback(async () => {
    try {
      setIsLoadingCollections(true);
      setCollectionsError(null);

      const response = await fetch(
        "http://localhost:5000/api/animeTribes/collections?isActive=true&page=1&limit=50&allStatus=true",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch collections: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        // Transform API data to match our Collection interface
        console.log("Fetched collections:", result.data);
        const transformedCollections = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          image: item.image,
          slug: item.slug,
          status: item.status,
          itemCount: item.itemCount || 0,
          createdAt: item.createdAt,
        }));

        setCollections(transformedCollections);
      } else {
        throw new Error(result.message || "Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollectionsError(
        error instanceof Error
          ? error.message
          : "Failed to load collections. Please try again."
      );

      // Fallback to mock data if API fails
      setCollections(mockCollections);

      toast({
        title: "Warning",
        description:
          "Using demo data. Check your connection and try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCollections(false);
    }
  }, []);

  // Load collections on component mount
  useEffect(() => {
    fetchCollections();
  }, []);

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCollection = async () => {
    // Frontend validation for required fields (matching backend requirements)
    if (
      !newCollection.name ||
      !newCollection.slug ||
      !newCollection.description
    ) {
      const missingFields = [];
      if (!newCollection.name) missingFields.push("Name");
      if (!newCollection.slug) missingFields.push("Slug");
      if (!newCollection.description) missingFields.push("Description");

      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Additional frontend validation
    if (newCollection.description.length < 10) {
      toast({
        title: "Invalid Description",
        description: "Description must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newCollection.description.length > 1000) {
      toast({
        title: "Description Too Long",
        description: "Description must be less than 1000 characters",
        variant: "destructive",
      });
      return;
    }

    // Check if slug is available before submitting
    if (slugCheckState.isAvailable === false) {
      toast({
        title: "Slug Conflict",
        description:
          "Please choose a different slug as this one is already taken",
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

    try {
      setIsCreating(true);

      // Prepare payload for backend API
      const payload = {
        name: newCollection.name,
        nameSlug: newCollection.slug,
        description: newCollection.description || "",
        image: newCollection.image || "",
        isActive: newCollection.status === "active",
        isFeatured: newCollection.isFeatured,
        sortOrder: newCollection.sortOrder,
        seoTitle:
          newCollection.seoTitle || `${newCollection.name} | Anime Collection`,
        seoDescription:
          newCollection.seoDescription ||
          newCollection.description ||
          `Discover amazing ${newCollection.name} merchandise and collectibles`,
        seoKeywords: newCollection.seoKeywords
          ? newCollection.seoKeywords
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k)
          : [
              newCollection.name.toLowerCase(),
              "anime",
              "collection",
              "merchandise",
            ],
        metaData: {
          animeStudio: newCollection.animeStudio || "Unknown",
          genre: newCollection.genre,
          releaseYear: newCollection.releaseYear,
          popularity: newCollection.popularity,
          season: newCollection.season,
          year: newCollection.releaseYear,
          isLimited: newCollection.isLimited,
          eventType: newCollection.eventType,
          productCategory: newCollection.productCategory,
          clothingType: newCollection.clothingType,
          quality: newCollection.quality,
          itemTypes: newCollection.itemTypes,
          itemType: newCollection.itemType,
          isCollectible: newCollection.isCollectible,
          isClassic: newCollection.isClassic,
          isModern: newCollection.isModern,
          hasClassics: newCollection.hasClassics,
        },
      };

      const response = await fetch(
        "http://localhost:5000/api/animeTribes/collections/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      // Handle different HTTP status codes from backend
      if (!response.ok) {
        switch (response.status) {
          case 400:
            // Bad Request - Missing required fields or validation errors
            if (result.requiredFields) {
              toast({
                title: "Required Fields Missing",
                description: `Backend validation failed: ${result.requiredFields.join(
                  ", "
                )} are required`,
                variant: "destructive",
              });
            } else if (result.errors) {
              // Mongoose validation errors
              const errorMessages = result.errors
                .map((err: any) => `${err.field}: ${err.message}`)
                .join(", ");
              toast({
                title: "Validation Error",
                description: errorMessages,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Validation Error",
                description: result.message || "Invalid data provided",
                variant: "destructive",
              });
            }
            return;

          case 409:
            // Conflict - Slug already exists or duplicate key error
            if (result.conflictField === "nameSlug" || result.duplicateField) {
              const field = result.conflictField || result.duplicateField;
              const fieldName = field === "nameSlug" ? "slug" : field;

              toast({
                title: "Duplicate Entry",
                description: `A collection with this ${fieldName} already exists. Please choose a different ${fieldName}.`,
                variant: "destructive",
              });

              // Reset slug check state to force user to pick a new slug
              if (field === "nameSlug") {
                setSlugCheckState({
                  isChecking: false,
                  isAvailable: false,
                  error: null,
                });
              }
            } else {
              toast({
                title: "Conflict Error",
                description: result.message || "This collection already exists",
                variant: "destructive",
              });
            }
            return;

          case 500:
            // Internal Server Error
            toast({
              title: "Server Error",
              description:
                "An internal server error occurred. Please try again later.",
              variant: "destructive",
            });
            console.error("Server error details:", result);
            return;

          default:
            // Handle other HTTP status codes
            toast({
              title: "Request Failed",
              description:
                result.message ||
                `Server responded with status ${response.status}`,
              variant: "destructive",
            });
            return;
        }
      }

      // Handle successful response (201 Created)
      if (result.success && response.status === 201) {
        console.log("Collection created successfully:", result.data);

        // Show success message with collection details
        const summary = result.summary || {
          name: result.data?.name,
          slug: result.data?.nameSlug,
          isActive: result.data?.isActive,
          isFeatured: result.data?.isFeatured,
        };

        toast({
          title: "Success",
          description: `Collection "${
            summary.name
          }" has been created successfully${
            summary.isActive ? " and is now active" : " as draft"
          }`,
        });

        // Refresh collections list to include the new collection
        await fetchCollections();
        setIsAddDialogOpen(false);

        // Reset form and states
        setNewCollection({
          name: "",
          description: "",
          slug: "",
          status: "draft",
          image: "",
          isFeatured: false,
          sortOrder: collections.length + 1,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          animeStudio: "",
          genre: ["Anime"],
          releaseYear: new Date().getFullYear(),
          popularity: "medium",
          season: "all_seasons",
          isLimited: false,
          eventType: "regular",
          productCategory: "apparel",
          clothingType: ["t-shirts", "hoodies"],
          quality: "premium",
          itemTypes: ["clothing", "accessories"],
          itemType: "merchandise",
          isCollectible: true,
          isClassic: false,
          isModern: true,
          hasClassics: false,
        });
        setSlugCheckState({
          isChecking: false,
          isAvailable: null,
          error: null,
        });
        setImageUploadState({
          isUploading: false,
          error: null,
        });

        toast({
          title: "Success",
          description: "Collection has been created successfully",
        });
      } else {
        // Handle unexpected successful response format
        toast({
          title: "Unexpected Response",
          description:
            "Collection may have been created but response format was unexpected",
          variant: "destructive",
        });
        console.warn("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Error creating collection:", error);

      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Network error
        toast({
          title: "Network Error",
          description:
            "Unable to connect to server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (error instanceof SyntaxError) {
        // JSON parsing error
        toast({
          title: "Response Error",
          description:
            "Received invalid response from server. Please try again.",
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        // Other known errors
        toast({
          title: "Error",
          description:
            error.message || "Failed to create collection. Please try again.",
          variant: "destructive",
        });
      } else {
        // Unknown errors
        toast({
          title: "Unknown Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCollection = () => {
    if (!selectedCollection) return;

    // In a real app, this would be an API call
    setCollections(
      collections.filter(
        (collection) => collection.id !== selectedCollection.id
      )
    );
    setIsDeleteDialogOpen(false);
    setSelectedCollection(null);

    toast({
      title: "Success",
      description: "Collection has been deleted successfully",
    });
  };

  const getStatusBadgeColor = (status: CollectionStatus) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-amber-100 text-amber-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  // Debounced slug checking function
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
      const response = await fetch("/api/collections/check-slug", {
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

  // Handle name change with automatic slug generation and checking
  const handleNameChange = (name: string) => {
    const generatedSlug = generateSlug(name);

    setNewCollection({
      ...newCollection,
      name,
      slug: generatedSlug,
    });

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
  };

  // Handle manual slug change
  const handleSlugChange = (slug: string) => {
    setNewCollection({
      ...newCollection,
      slug,
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

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, JPG, or PNG image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    const selectedFiles = [file];

    if (selectedFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }

    setImageUploadState({
      isUploading: true,
      error: null,
    });

    const formData = new FormData();

    // Add all selected files
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/animeTribes/collections/upload-images",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log("Uploaded images:", result.data.images);
        // result.data.images contains array of uploaded image objects with URLs

        // Assuming the first image from the uploaded array
        const uploadedImage = result.data.images[0];

        setNewCollection({
          ...newCollection,
          image: uploadedImage.url || uploadedImage.imageUrl,
        });

        setImageUploadState({
          isUploading: false,
          error: null,
        });

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageUploadState({
        isUploading: false,
        error: "Failed to upload image",
      });

      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setNewCollection({
      ...newCollection,
      image: "",
    });
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
            <p className="text-gray-500">Manage product collections</p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                // Reset form and slug check state when dialog is closed
                setNewCollection({
                  name: "",
                  description: "",
                  slug: "",
                  status: "draft",
                  image: "",
                  isFeatured: false,
                  sortOrder: collections.length + 1,
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                  animeStudio: "",
                  genre: ["Anime"],
                  releaseYear: new Date().getFullYear(),
                  popularity: "medium",
                  season: "all_seasons",
                  isLimited: false,
                  eventType: "regular",
                  productCategory: "apparel",
                  clothingType: ["t-shirts", "hoodies"],
                  quality: "premium",
                  itemTypes: ["clothing", "accessories"],
                  itemType: "merchandise",
                  isCollectible: true,
                  isClassic: false,
                  isModern: true,
                  hasClassics: false,
                });
                setSlugCheckState({
                  isChecking: false,
                  isAvailable: null,
                  error: null,
                });
                setImageUploadState({
                  isUploading: false,
                  error: null,
                });
                setIsCreating(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle>Add New Collection</DialogTitle>
                <DialogDescription>
                  Create a new product collection to organize your products.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 pl-3 pr-3 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newCollection.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="slug"
                        value={newCollection.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
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
                    {!slugCheckState.isChecking && !slugCheckState.error && (
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="space-y-2">
                    <Textarea
                      id="description"
                      value={newCollection.description}
                      onChange={(e) =>
                        setNewCollection({
                          ...newCollection,
                          description: e.target.value,
                        })
                      }
                      className={`min-h-[72px] max-h-[72px] resize-none ${
                        newCollection.description.length < 10 ||
                        newCollection.description.length > 1000
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      rows={3}
                      placeholder="Enter collection description (10-1000 characters)"
                    />
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {newCollection.description.length < 10 &&
                          newCollection.description.length > 0 && (
                            <span className="text-red-600">
                              Minimum 10 characters required
                            </span>
                          )}
                        {newCollection.description.length > 1000 && (
                          <span className="text-red-600">
                            Maximum 1000 characters exceeded
                          </span>
                        )}
                        {newCollection.description.length >= 10 &&
                          newCollection.description.length <= 1000 && (
                            <span className="text-green-600">
                              ✓ Description length is valid
                            </span>
                          )}
                      </div>
                      <div
                        className={`text-xs ${
                          newCollection.description.length < 10 ||
                          newCollection.description.length > 1000
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {newCollection.description.length}/1000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={newCollection.status}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        status: e.target.value as CollectionStatus,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {newCollection.image ? (
                      // Show uploaded image with remove button
                      <div className="relative inline-block">
                        <div className="relative h-24 w-24 rounded-md overflow-hidden border">
                          <Image
                            src={newCollection.image}
                            alt="Collection preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      // Show upload button
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={triggerFileInput}
                          disabled={imageUploadState.isUploading}
                        >
                          {imageUploadState.isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {imageUploadState.error && (
                      <p className="text-xs text-red-600 mt-2">
                        {imageUploadState.error}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 800x600px. Max file size: 2MB. Allowed
                      formats: JPEG, JPG, PNG
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <div className="flex items-center">
                    <input
                      id="isFeatured"
                      type="checkbox"
                      checked={newCollection.isFeatured}
                      onChange={(e) =>
                        setNewCollection({
                          ...newCollection,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm">
                      Mark as featured collection
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={newCollection.sortOrder}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        sortOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={newCollection.seoTitle}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        seoTitle: e.target.value,
                      })
                    }
                    placeholder="Leave empty to auto-generate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={newCollection.seoDescription}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        seoDescription: e.target.value,
                      })
                    }
                    className="min-h-[60px] resize-none"
                    rows={2}
                    placeholder="Leave empty to auto-generate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={newCollection.seoKeywords}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        seoKeywords: e.target.value,
                      })
                    }
                    placeholder="Comma-separated keywords (leave empty to auto-generate)"
                  />
                </div>

                {/* Anime Metadata */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Anime Metadata</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animeStudio">Anime Studio</Label>
                  <Input
                    id="animeStudio"
                    value={newCollection.animeStudio}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        animeStudio: e.target.value,
                      })
                    }
                    placeholder="e.g., Studio Ghibli, Madhouse"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseYear">Release Year</Label>
                  <Input
                    id="releaseYear"
                    type="number"
                    value={newCollection.releaseYear}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        releaseYear:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    min="1950"
                    max={new Date().getFullYear() + 5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="popularity">Popularity</Label>
                  <select
                    id="popularity"
                    value={newCollection.popularity}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        popularity: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="season">Season</Label>
                  <Input
                    id="season"
                    value={newCollection.season}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        season: e.target.value,
                      })
                    }
                    placeholder="e.g., spring_2024, all_seasons"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    value={newCollection.eventType}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        eventType: e.target.value,
                      })
                    }
                    placeholder="e.g., regular, special, limited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Input
                    id="productCategory"
                    value={newCollection.productCategory}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        productCategory: e.target.value,
                      })
                    }
                    placeholder="e.g., apparel, accessories, collectibles"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Quality</Label>
                  <select
                    id="quality"
                    value={newCollection.quality}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        quality: e.target.value as
                          | "basic"
                          | "premium"
                          | "luxury",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type</Label>
                  <Input
                    id="itemType"
                    value={newCollection.itemType}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        itemType: e.target.value,
                      })
                    }
                    placeholder="e.g., merchandise, collectible, accessory"
                  />
                </div>

                {/* Collection Flags */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">
                    Collection Properties
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="isLimited"
                        type="checkbox"
                        checked={newCollection.isLimited}
                        onChange={(e) =>
                          setNewCollection({
                            ...newCollection,
                            isLimited: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="isLimited" className="text-sm">
                        Limited Edition
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="isCollectible"
                        type="checkbox"
                        checked={newCollection.isCollectible}
                        onChange={(e) =>
                          setNewCollection({
                            ...newCollection,
                            isCollectible: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="isCollectible" className="text-sm">
                        Collectible
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="isClassic"
                        type="checkbox"
                        checked={newCollection.isClassic}
                        onChange={(e) =>
                          setNewCollection({
                            ...newCollection,
                            isClassic: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="isClassic" className="text-sm">
                        Classic
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="isModern"
                        type="checkbox"
                        checked={newCollection.isModern}
                        onChange={(e) =>
                          setNewCollection({
                            ...newCollection,
                            isModern: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="isModern" className="text-sm">
                        Modern
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="hasClassics"
                        type="checkbox"
                        checked={newCollection.hasClassics}
                        onChange={(e) =>
                          setNewCollection({
                            ...newCollection,
                            hasClassics: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="hasClassics" className="text-sm">
                        Has Classics
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-shrink-0">
                <Button
                  type="submit"
                  onClick={handleAddCollection}
                  disabled={
                    !newCollection.name ||
                    !newCollection.slug ||
                    slugCheckState.isChecking ||
                    slugCheckState.isAvailable === false ||
                    isCreating
                  }
                >
                  {isCreating
                    ? "Creating..."
                    : slugCheckState.isChecking
                    ? "Checking..."
                    : "Add Collection"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
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
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
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
                      <div className="max-w">
                        <div className="font-medium">{collection.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {collection.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{collection.itemCount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(collection.status)}>
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(collection.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={`/collections/${collection.slug}`}
                            target="_blank"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/collections/${collection.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <Dialog
                          open={isDeleteDialogOpen}
                          onOpenChange={setIsDeleteDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCollection(collection)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete the collection "
                                {selectedCollection?.name}"? This action cannot
                                be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteCollection}
                              >
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
  );
}
