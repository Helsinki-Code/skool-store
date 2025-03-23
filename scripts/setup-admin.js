#!/usr/bin/env node

// Load .env.local file
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Admin credentials
const ADMIN_EMAIL = 'vtu8022@gmail.com';
const ADMIN_PASSWORD = '9550038093';

// Initialize Supabase client with service role key (required for admin operations)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  console.log('Setting up admin user...');
  
  try {
    // 1. Check if the user exists
    console.log(`Checking if admin user ${ADMIN_EMAIL} exists...`);
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      throw new Error(`Error checking users: ${userError.message}`);
    }
    
    let userId;
    const existingUser = userData?.users?.find(user => user.email === ADMIN_EMAIL);
    
    if (existingUser) {
      console.log(`Admin user ${ADMIN_EMAIL} exists, updating password...`);
      userId = existingUser.id;
      
      // Update the password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: ADMIN_PASSWORD }
      );
      
      if (updateError) {
        throw new Error(`Error updating user password: ${updateError.message}`);
      }
      
      console.log('Password updated successfully');
    } else {
      console.log(`Admin user ${ADMIN_EMAIL} does not exist, creating new user...`);
      
      // Create a new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true // Auto-confirm the email
      });
      
      if (createError) {
        throw new Error(`Error creating user: ${createError.message}`);
      }
      
      userId = newUser.user.id;
      console.log(`New admin user created with ID: ${userId}`);
    }
    
    // 2. Ensure the user has the admin flag in the profiles table
    console.log('Setting admin flag in profiles table...');
    
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw new Error(`Error checking profile: ${profileError.message}`);
    }
    
    if (profile) {
      // Update existing profile
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', userId);
        
      if (updateProfileError) {
        throw new Error(`Error updating profile: ${updateProfileError.message}`);
      }
      
      console.log('Profile updated with admin flag');
    } else {
      // Create new profile
      const { error: insertProfileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: 'Admin User',
          email: ADMIN_EMAIL,
          is_admin: true
        });
        
      if (insertProfileError) {
        throw new Error(`Error creating profile: ${insertProfileError.message}`);
      }
      
      console.log('New profile created with admin flag');
    }
    
    console.log('✅ Admin setup completed successfully!');
    console.log(`You can now log in as admin with email: ${ADMIN_EMAIL}`);
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    process.exit(1);
  }
}

// Run the setup function
setupAdmin(); 