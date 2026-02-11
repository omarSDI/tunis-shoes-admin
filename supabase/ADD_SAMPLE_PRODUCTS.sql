-- Add Sample Products to Your Database
-- Run this in Supabase SQL Editor to populate your shop with products

-- First, let's see what you currently have
SELECT id, title, price, description FROM products;

-- Now let's add some sample shoe products
-- Note: Adjust the image URLs, prices, and details as needed

INSERT INTO products (title, price, description, image_url, sizes, color, created_at, updated_at)
VALUES 
  (
    'Classic Leather Sneakers',
    89.99,
    'Premium leather sneakers with comfortable cushioning. Perfect for everyday wear.',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44, 45],
    'White',
    NOW(),
    NOW()
  ),
  (
    'Running Shoes Pro',
    129.99,
    'High-performance running shoes with advanced cushioning technology.',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44, 45],
    'Black',
    NOW(),
    NOW()
  ),
  (
    'Casual Canvas Shoes',
    59.99,
    'Comfortable canvas shoes for casual outings. Lightweight and breathable.',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44],
    'Navy Blue',
    NOW(),
    NOW()
  ),
  (
    'Formal Oxford Shoes',
    149.99,
    'Elegant Oxford shoes crafted from premium leather. Perfect for formal occasions.',
    'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800',
    ARRAY[39, 40, 41, 42, 43, 44, 45],
    'Brown',
    NOW(),
    NOW()
  ),
  (
    'Sports Training Shoes',
    99.99,
    'Versatile training shoes designed for gym and outdoor activities.',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44, 45],
    'Red',
    NOW(),
    NOW()
  ),
  (
    'High-Top Basketball Shoes',
    159.99,
    'Professional basketball shoes with ankle support and superior grip.',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    ARRAY[39, 40, 41, 42, 43, 44, 45, 46],
    'Black/Red',
    NOW(),
    NOW()
  ),
  (
    'Slip-On Loafers',
    79.99,
    'Comfortable slip-on loafers for effortless style. Perfect for smart-casual wear.',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44],
    'Tan',
    NOW(),
    NOW()
  ),
  (
    'Hiking Boots',
    139.99,
    'Durable hiking boots with waterproof protection and excellent traction.',
    'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800',
    ARRAY[39, 40, 41, 42, 43, 44, 45],
    'Brown/Green',
    NOW(),
    NOW()
  ),
  (
    'Minimalist Sneakers',
    69.99,
    'Clean and simple design. Perfect for minimalist fashion enthusiasts.',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
    ARRAY[38, 39, 40, 41, 42, 43, 44],
    'White/Grey',
    NOW(),
    NOW()
  ),
  (
    'Premium Suede Boots',
    179.99,
    'Luxurious suede boots with premium craftsmanship. A timeless classic.',
    'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800',
    ARRAY[39, 40, 41, 42, 43, 44, 45],
    'Beige',
    NOW(),
    NOW()
  );

-- Verify the products were added
SELECT COUNT(*) as "Total Products After Insert" FROM products;

-- Show all products
SELECT id, title, price, color FROM products ORDER BY created_at DESC;

-- ============================================================================
-- DONE! You should now have 11 products in your database (1 existing + 10 new)
-- Refresh your website to see them!
-- ============================================================================
