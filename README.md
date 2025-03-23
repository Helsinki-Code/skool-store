# Skool Store

A digital products store built with Next.js, Supabase, and Stripe. Sell digital products, manage orders, and handle payments with ease.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Components:** Shadcn UI, Radix UI
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth

## Features

- User authentication (sign up, sign in, forgot password)
- Product browsing and filtering by categories
- Shopping cart with localStorage persistence
- Checkout with Stripe
- Admin dashboard for managing products, categories, and orders
- User dashboard for viewing purchased products and order history
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Environment Setup

1. Clone the repository
2. Copy the `.env.local` file and update it with your credentials:

```
# Supabase environment variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe environment variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

1. Run the SQL commands in `schema.sql` in your Supabase SQL editor to create the necessary tables
2. Run the SQL commands in `seed.sql` to populate the database with sample data
3. Run the SQL commands in `update_admin.sql` to create admin roles (if necessary)

### Product Catalog Setup

The application supports loading a comprehensive product catalog from `data/Products.md`. This file contains a well-structured set of digital products across multiple categories that can be imported into your database.

To import the products:

1. Ensure you have added the `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file (available in your Supabase dashboard under Project Settings > API)
2. Make the seeding script executable: `chmod +x scripts/run-seed.sh`
3. Run the seeding script: `./scripts/run-seed.sh`

This will parse the Products.md file and create all categories and products in your Supabase database.

### Stripe Integration

For seamless payments with Stripe:

1. Create a Stripe account if you don't have one at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add the following variables to your `.env.local` file:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   ```

4. Set up Stripe webhook for processing orders:
   - In the Stripe Dashboard, go to Developers > Webhooks > Add endpoint
   - Set the endpoint URL to `https://your-domain.com/api/webhooks/stripe`
   - Select events to listen for (at minimum: `checkout.session.completed` and `payment_intent.succeeded`)
   - Get the webhook signing secret and add it to your `.env.local` file:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
     ```

5. For local development, you can use the Stripe CLI to forward webhooks to your local environment:
   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start
```

### Supabase Configuration

1. Set up authentication in your Supabase dashboard
2. Configure Row Level Security (RLS) policies for your tables
3. Create storage buckets for product files and images

### Stripe Configuration

1. Set up your Stripe account and get your API keys
2. Set up webhooks for handling payment events
3. Configure products in your Stripe dashboard (optional)

## Admin Access

Admin access is restricted to specific email addresses configured in `lib/admin.ts`. By default, the email `vtu8022@gmail.com` has admin access.

To add more admin users, update the `ADMIN_EMAILS` array in `lib/admin.ts`.

## Folder Structure

- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utility functions and context providers
- `public/` - Static assets
- `types/` - TypeScript type definitions
- `styles/` - Global CSS styles

## Contributing

Feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License. 