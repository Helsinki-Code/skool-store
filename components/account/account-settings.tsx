"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"

interface AccountSettingsProps {
  userData: {
    user: User
    profile: any
  }
}

export default function AccountSettings({ userData }: AccountSettingsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { signOut } = useAuth()
  const { user, profile } = userData

  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating password:", error)
      setPasswordError(error.message || "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleUpdatePreferences = async () => {
    setIsUpdatingPreferences(true)

    try {
      // In a real app, you would save these preferences to the database
      setTimeout(() => {
        toast({
          title: "Preferences updated",
          description: "Your notification preferences have been updated.",
        })
      }, 1000)
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPreferences(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      // Delete user data from the database
      await supabase.from("profiles").delete().eq("id", user.id)

      // Delete the user authentication account
      const { error } = await supabase.auth.admin.deleteUser(user.id)

      if (error) {
        throw error
      }

      // Sign out the user
      await signOut()

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Delete failed",
        description: "There was a problem deleting your account.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2 font-space-grotesk text-3xl font-bold tracking-tight sm:text-4xl">Account Settings</h1>
          <p className="mb-8 text-muted-foreground">Manage your account settings and preferences</p>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={user.email || ""} disabled />
                      <p className="text-xs text-muted-foreground">To change your email, please contact support.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingProfile}>
                      {isUpdatingProfile ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                  <CardContent className="space-y-4">
                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive order confirmations and updates</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive news, offers and promotions</p>
                    </div>
                    <Switch id="marketingEmails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleUpdatePreferences} disabled={isUpdatingPreferences}>
                    {isUpdatingPreferences ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="danger">
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Actions in this section can lead to permanent data loss</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-destructive/20 p-4">
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Once you delete your account, there is no going back. All your data will be permanently removed.
                    </p>
                    <Button variant="destructive" className="mt-4" onClick={handleDeleteAccount} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

