import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    
    // 1. Check if vtu8022@gmail.com exists in auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      return NextResponse.json({ error: "Failed to list users", details: authError }, { status: 500 })
    }
    
    const adminEmail = "vtu8022@gmail.com"
    let adminUser = authUsers.users.find(user => user.email === adminEmail)
    
    // 2. Create admin user if not exists
    if (!adminUser) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: "9550038093",
        email_confirm: true,
      })
      
      if (createError) {
        return NextResponse.json({ error: "Failed to create admin user", details: createError }, { status: 500 })
      }
      
      adminUser = newUser.user
    }
    
    // 3. Make sure profiles table has admin record
    const { data: profileExists, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id, is_admin")
      .eq("id", adminUser.id)
      .single()
    
    if (profileCheckError && profileCheckError.code !== "PGRST116") {
      // Error other than not found
      return NextResponse.json({ error: "Failed to check profile", details: profileCheckError }, { status: 500 })
    }
    
    // 4. Insert or update profile with admin flag
    let profileOperation
    
    if (!profileExists) {
      // Insert new profile
      profileOperation = await supabase
        .from("profiles")
        .insert({
          id: adminUser.id,
          full_name: "Admin User",
          is_admin: true,
        })
    } else {
      // Update existing profile
      profileOperation = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", adminUser.id)
    }
    
    if (profileOperation.error) {
      return NextResponse.json({ error: "Failed to update profile", details: profileOperation.error }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: `Admin user ${adminEmail} is configured and ready to use`,
      userId: adminUser.id,
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 })
  }
} 