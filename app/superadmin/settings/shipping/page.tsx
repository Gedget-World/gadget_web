"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Globe, DollarSign, Package } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/admin-layout"
import { useAdminAuth } from "@/context/admin-auth-context"

// Mock shipping methods data
const mockShippingMethods = [
  {
    id: "ship-1",
    name: "Standard Shipping",
    description: "3-5 business days",
    price: 5.99,
    freeThreshold: 50,
    status: "active",
    countries: ["US", "CA"],
    estimatedDays: "3-5",
  },
  {
    id: "ship-2",
    name: "Express Shipping",
    description: "1-2 business days",
    price: 12.99,
    freeThreshold: 100,
    status: "active",
    countries: ["US", "CA", "MX"],
    estimatedDays: "1-2",
  },
  {
    id: "ship-3",
    name: "International Standard",
    description: "7-14 business days",
    price: 15.99,
    freeThreshold: 150,
    status: "active",
    countries: ["GB", "FR", "DE", "IT", "ES"],
    estimatedDays: "7-14",
  },
  {
    id: "ship-4",
    name: "International Express",
    description: "3-5 business days",
    price: 25.99,
    freeThreshold: 200,
    status: "active",
    countries: ["GB", "FR", "DE", "IT", "ES"],
    estimatedDays: "3-5",
  },
  {
    id: "ship-5",
    name: "Same Day Delivery",
    description: "Same day delivery for select cities",
    price: 19.99,
    freeThreshold: null,
    status: "inactive",
    countries: ["US"],
    estimatedDays: "0-1",
  },
]

// Mock shipping zones data
const mockShippingZones = [
  {
    id: "zone-1",
    name: "United States",
    countries: ["US"],
    methods: ["Standard Shipping", "Express Shipping", "Same Day Delivery"],
  },
  {
    id: "zone-2",
    name: "North America",
    countries: ["CA", "MX"],
    methods: ["Standard Shipping", "Express Shipping"],
  },
  {
    id: "zone-3",
    name: "Europe",
    countries: ["GB", "FR", "DE", "IT", "ES"],
    methods: ["International Standard", "International Express"],
  },
]

export default function ShippingSettingsPage() {
  const [shippingMethods, setShippingMethods] = useState(mockShippingMethods)
  const [shippingZones] = useState(mockShippingZones)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(50)

  const { toast } = useToast()
  const { hasPermission } = useAdminAuth()
  const canManageShipping = hasPermission("manage_shipping_methods")

  const handleDeleteMethod = () => {
    if (!selectedMethod) return

    // In a real app, this would be an API call
    setShippingMethods(shippingMethods.filter((method) => method.id !== selectedMethod.id))
    setIsDeleteDialogOpen(false)
    setSelectedMethod(null)

    toast({
      title: "Success",
      description: "Shipping method has been deleted successfully",
    })
  }

  const handleSaveSettings = () => {
    // In a real app, this would be an API call
    toast({
      title: "Success",
      description: "Shipping settings have been saved successfully",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Settings</h1>
          <p className="text-gray-500">Configure shipping methods, zones, and rates</p>
        </div>

        <Tabs defaultValue="methods">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="methods">Shipping Methods</TabsTrigger>
            <TabsTrigger value="settings">General Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Shipping Methods</h2>
              {canManageShipping && (
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Method
                </Button>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Free Shipping</TableHead>
                    <TableHead>Estimated Delivery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shippingMethods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No shipping methods found
                      </TableCell>
                    </TableRow>
                  ) : (
                    shippingMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-gray-500">{method.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(method.price)}</TableCell>
                        <TableCell>
                          {method.freeThreshold ? (
                            <span>Over {formatCurrency(method.freeThreshold)}</span>
                          ) : (
                            <span className="text-gray-500">Not available</span>
                          )}
                        </TableCell>
                        <TableCell>{method.estimatedDays} business days</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              method.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canManageShipping && (
                              <>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedMethod(method)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Confirm Deletion</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete the shipping method "{selectedMethod?.name}"?
                                        This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button variant="destructive" onClick={handleDeleteMethod}>
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

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Zones</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shippingZones.map((zone) => (
                  <Card key={zone.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="mr-2 h-5 w-5" />
                        {zone.name}
                      </CardTitle>
                      <CardDescription>
                        {zone.countries.length} {zone.countries.length === 1 ? "country" : "countries"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Countries:</div>
                        <div className="flex flex-wrap gap-1">
                          {zone.countries.map((country) => (
                            <Badge key={country} variant="outline">
                              {country}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-sm font-medium mt-4">Available Methods:</div>
                        <ul className="text-sm">
                          {zone.methods.map((method) => (
                            <li key={method} className="py-1">
                              {method}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {canManageShipping && (
                        <Button variant="outline" className="w-full mt-4">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Zone
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {canManageShipping && (
                  <Card className="flex flex-col items-center justify-center p-6 border-dashed">
                    <Button variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Shipping Zone
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Shipping Settings</CardTitle>
                <CardDescription>Configure global shipping options for your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="free-shipping">Free Shipping</Label>
                      <p className="text-sm text-gray-500">Offer free shipping on orders above a certain amount</p>
                    </div>
                    <Switch id="free-shipping" checked={freeShippingEnabled} onCheckedChange={setFreeShippingEnabled} />
                  </div>

                  {freeShippingEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Free Shipping Threshold</Label>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                        <Input
                          id="threshold"
                          type="number"
                          value={freeShippingThreshold}
                          onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                          className="max-w-[120px]"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Orders above this amount will qualify for free shipping</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="calculation">Shipping Calculation</Label>
                    <select
                      id="calculation"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="flat">Flat rate per order</option>
                      <option value="weight">Based on weight</option>
                      <option value="price">Based on price</option>
                      <option value="item">Per item</option>
                    </select>
                    <p className="text-sm text-gray-500">Choose how shipping costs are calculated for your products</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Require Product Dimensions</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="dimensions" className="rounded border-gray-300" />
                      <Label htmlFor="dimensions">Require weight and dimensions for all products</Label>
                    </div>
                    <p className="text-sm text-gray-500">This will help calculate accurate shipping costs</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tracking">Default Tracking Provider</Label>
                    <select
                      id="tracking"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="usps">USPS</option>
                      <option value="ups">UPS</option>
                      <option value="fedex">FedEx</option>
                      <option value="dhl">DHL</option>
                    </select>
                  </div>
                </div>

                {canManageShipping && (
                  <Button onClick={handleSaveSettings} className="mt-6">
                    <Package className="mr-2 h-4 w-4" />
                    Save Shipping Settings
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
