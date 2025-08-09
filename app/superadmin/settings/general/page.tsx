"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin/admin-layout"

export default function GeneralSettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Fashion E-commerce",
    storeDescription: "Shop the latest fashion trends",
    contactEmail: "support@fashion-store.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Fashion St, New York, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
    enableMaintenanceMode: false,
  })

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Fashion E-commerce | Shop the latest trends",
    metaDescription: "Discover the latest fashion trends for men and women. Shop now for the best deals!",
    metaKeywords: "fashion, clothing, apparel, shoes, accessories, men, women",
    ogImage: "/placeholder.svg?height=600&width=1200",
    twitterHandle: "@fashionstore",
    enableSitemap: true,
    enableRobotsTxt: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleStoreSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setStoreSettings({
      ...storeSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSeoSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setSeoSettings({
      ...seoSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSwitchChange = (name, checked, settingsType) => {
    if (settingsType === "store") {
      setStoreSettings({
        ...storeSettings,
        [name]: checked,
      })
    } else if (settingsType === "seo") {
      setSeoSettings({
        ...seoSettings,
        [name]: checked,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Settings have been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
          <p className="text-gray-500">Configure your store settings</p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store">Store Information</TabsTrigger>
            <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>Manage your store details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        value={storeSettings.storeName}
                        onChange={handleStoreSettingsChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        name="currency"
                        value={storeSettings.currency}
                        onChange={handleStoreSettingsChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      name="storeDescription"
                      value={storeSettings.storeDescription}
                      onChange={handleStoreSettingsChange}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={storeSettings.contactEmail}
                        onChange={handleStoreSettingsChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={storeSettings.contactPhone}
                        onChange={handleStoreSettingsChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={storeSettings.address}
                      onChange={handleStoreSettingsChange}
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        name="timezone"
                        value={storeSettings.timezone}
                        onChange={handleStoreSettingsChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                        <option value="Europe/Paris">Central European Time (CET)</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch
                        id="enableMaintenanceMode"
                        checked={storeSettings.enableMaintenanceMode}
                        onCheckedChange={(checked) => handleSwitchChange("enableMaintenanceMode", checked, "store")}
                      />
                      <Label htmlFor="enableMaintenanceMode">Enable Maintenance Mode</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="seo">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Optimize your store for search engines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      value={seoSettings.metaTitle}
                      onChange={handleSeoSettingsChange}
                    />
                    <p className="text-xs text-gray-500">Recommended length: 50-60 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={seoSettings.metaDescription}
                      onChange={handleSeoSettingsChange}
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">Recommended length: 150-160 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      name="metaKeywords"
                      value={seoSettings.metaKeywords}
                      onChange={handleSeoSettingsChange}
                    />
                    <p className="text-xs text-gray-500">Separate keywords with commas</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">Open Graph Image URL</Label>
                      <Input
                        id="ogImage"
                        name="ogImage"
                        value={seoSettings.ogImage}
                        onChange={handleSeoSettingsChange}
                      />
                      <p className="text-xs text-gray-500">Recommended size: 1200x630 pixels</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterHandle">Twitter Handle</Label>
                      <Input
                        id="twitterHandle"
                        name="twitterHandle"
                        value={seoSettings.twitterHandle}
                        onChange={handleSeoSettingsChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableSitemap"
                        checked={seoSettings.enableSitemap}
                        onCheckedChange={(checked) => handleSwitchChange("enableSitemap", checked, "seo")}
                      />
                      <Label htmlFor="enableSitemap">Generate XML Sitemap</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableRobotsTxt"
                        checked={seoSettings.enableRobotsTxt}
                        onCheckedChange={(checked) => handleSwitchChange("enableRobotsTxt", checked, "seo")}
                      />
                      <Label htmlFor="enableRobotsTxt">Generate robots.txt</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
