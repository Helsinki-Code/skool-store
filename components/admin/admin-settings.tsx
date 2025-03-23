"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const socialMediaSchema = z.object({
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
})

const storeSettingsSchema = z.object({
  store_name: z.string().min(2, "Store name must be at least 2 characters"),
  store_description: z.string().min(10, "Description must be at least 10 characters"),
  contact_email: z.string().email("Invalid email address"),
  support_phone: z.string().optional(),
  business_address: z.string().min(5, "Address must be at least 5 characters"),
  currency: z.string().min(3, "Currency code must be 3 characters").max(3),
  tax_rate: z.number().min(0, "Tax rate cannot be negative").max(100, "Tax rate cannot exceed 100%"),
  shipping_fee: z.number().min(0, "Shipping fee cannot be negative"),
  free_shipping_threshold: z.number().min(0, "Threshold cannot be negative"),
  enable_user_reviews: z.boolean(),
  enable_wishlist: z.boolean(),
  maintenance_mode: z.boolean(),
  social_media: socialMediaSchema,
})

type StoreSettings = z.infer<typeof storeSettingsSchema>

interface AdminSettingsProps {
  initialSettings: StoreSettings
}

export function AdminSettings({ initialSettings }: AdminSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // Ensure all values have proper defaults to avoid null values
  const defaultValues: StoreSettings = {
    store_name: initialSettings?.store_name || "",
    store_description: initialSettings?.store_description || "",
    contact_email: initialSettings?.contact_email || "",
    support_phone: initialSettings?.support_phone || "",
    business_address: initialSettings?.business_address || "",
    currency: initialSettings?.currency || "USD",
    tax_rate: typeof initialSettings?.tax_rate === 'number' ? initialSettings.tax_rate : 0,
    shipping_fee: typeof initialSettings?.shipping_fee === 'number' ? initialSettings.shipping_fee : 0,
    free_shipping_threshold: typeof initialSettings?.free_shipping_threshold === 'number' ? initialSettings.free_shipping_threshold : 0,
    enable_user_reviews: initialSettings?.enable_user_reviews || false,
    enable_wishlist: initialSettings?.enable_wishlist || false,
    maintenance_mode: initialSettings?.maintenance_mode || false,
    social_media: {
      facebook: initialSettings?.social_media?.facebook || "",
      twitter: initialSettings?.social_media?.twitter || "",
      instagram: initialSettings?.social_media?.instagram || "",
    },
  }
  
  const form = useForm<StoreSettings>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues,
  })

  async function onSubmit(data: StoreSettings) {
    setIsLoading(true)
    
    try {
      // Save settings to the database
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Settings Saved",
        description: "Your store settings have been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Store Information</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="store_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your store displayed to customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="store_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormDescription>
                        A brief description of your store
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="support_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Social Media</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="social_media.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://facebook.com/yourstore" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="social_media.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://twitter.com/yourstore" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="social_media.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://instagram.com/yourstore" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>
          
          {/* Commerce Settings Tab */}
          <TabsContent value="commerce" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Pricing & Shipping</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency Code</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={3} placeholder="USD" />
                      </FormControl>
                      <FormDescription>
                        Three-letter currency code (e.g., USD, EUR, GBP)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tax_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value?.toString() || "0"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shipping_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Standard Shipping Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value?.toString() || "0"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="free_shipping_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Shipping Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value?.toString() || "0"}
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum order amount for free shipping (0 to disable)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>
          
          {/* Features Settings Tab */}
          <TabsContent value="features" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Store Features</h3>
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="enable_user_reviews"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">User Reviews</FormLabel>
                        <FormDescription>
                          Allow customers to leave product reviews
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enable_wishlist"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Wishlist</FormLabel>
                        <FormDescription>
                          Allow customers to save products to wishlist
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maintenance_mode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Maintenance Mode</FormLabel>
                        <FormDescription>
                          Temporarily disable store for maintenance
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 