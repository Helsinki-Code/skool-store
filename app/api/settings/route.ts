import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdmin } from "@/lib/admin"

export async function GET() {
  try {
    // Check if user is admin
    const { isAuthenticated, isAuthorized } = await isAdmin()

    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development" || (isAuthenticated && isAuthorized)) {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .eq("id", "default")
        .single()
      
      if (error) {
        console.error("Error fetching store settings:", error)
        
        // If the table doesn't exist, return empty settings
        if (error.code === "42P01") { // relation does not exist
          console.log("Store settings table does not exist yet")
          return NextResponse.json({ id: "default" })
        }
        
        return NextResponse.json(
          { error: "Failed to fetch store settings" }, 
          { status: 500 }
        )
      }
      
      // If no data found, return empty settings
      return NextResponse.json(data || { id: "default" })
    }
    
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  } catch (error) {
    console.error("Error in settings API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const { isAuthenticated, isAuthorized } = await isAdmin()

    // In development mode, bypass admin check
    if (process.env.NODE_ENV === "development" || (isAuthenticated && isAuthorized)) {
      const supabase = createClient()
      const settings = await request.json()
      
      // Ensure the ID is set for upsert
      settings.id = "default"
      
      // Validate required fields
      if (!settings.store_name || !settings.contact_email) {
        return NextResponse.json(
          { error: "Missing required fields" }, 
          { status: 400 }
        )
      }
      
      // Insert or update settings
      const { data, error } = await supabase
        .from("store_settings")
        .upsert(settings, { onConflict: "id" })
        .select()
        .single()
      
      if (error) {
        console.error("Error saving store settings:", error)
        return NextResponse.json(
          { error: "Failed to save settings" }, 
          { status: 500 }
        )
      }
      
      return NextResponse.json(data)
    }
    
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401 }
    )
  } catch (error) {
    console.error("Error in settings API:", error)
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    )
  }
} 