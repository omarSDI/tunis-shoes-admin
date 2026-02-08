# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully provisioned

## 2. Run the SQL Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `schema.sql` into the editor
3. Click "Run" to execute the SQL
4. This will create:
   - `products` table
   - `orders` table
   - `order_items` table
   - Indexes and triggers
   - Row Level Security (RLS) policies

## 3. Seed Initial Data (Optional)

1. In the SQL Editor, copy and paste the contents of `seed.sql`
2. Click "Run" to insert sample products
3. This will add 4 sample products to your database

## 4. Configure Environment Variables

1. In your Supabase dashboard, go to Settings > API
2. Copy your:
   - Project URL (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public Key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Create a `.env.local` file in the root of your project:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
4. Restart your Next.js development server

## 5. Verify Setup

- Products should now load from Supabase instead of hardcoded data
- You can test creating orders using the `createOrder` server action

## Database Schema Overview

### Products Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `price` (DECIMAL)
- `description` (TEXT)
- `images` (TEXT[])
- `colors` (TEXT[])
- `sizes` (INTEGER[])
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Orders Table
- `id` (UUID, Primary Key)
- `customer_name` (VARCHAR)
- `customer_email` (VARCHAR)
- `customer_phone` (VARCHAR)
- `total_amount` (DECIMAL)
- `status` (VARCHAR, default: 'pending')
- `shipping_address` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Order Items Table
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key to orders)
- `product_id` (UUID, Foreign Key to products)
- `product_name` (VARCHAR)
- `product_price` (DECIMAL)
- `quantity` (INTEGER)
- `size` (INTEGER, optional)
- `color` (VARCHAR, optional)
- `created_at` (TIMESTAMP)
