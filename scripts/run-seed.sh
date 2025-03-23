#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Error: .env.local file not found. Please create it first."
  exit 1
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing required environment variables."
  echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  exit 1
fi

echo "Starting product seeding process..."

# Install required dependencies if not already installed
if ! npm list slugify > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install slugify
fi

# Run the seeding script
echo "Running product seeder..."
node --experimental-json-modules scripts/seed-products.js

echo "Seeding process completed!" 