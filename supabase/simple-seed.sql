-- Seed data for products table
-- Note: Replace the UUIDs with actual UUIDs if you want specific IDs, or let them auto-generate

INSERT INTO products (title, price, description, image_url, sizes, color) VALUES
(
  'Classic Leather Sneakers',
  199.00,
  'Timeless elegance meets modern comfort. These classic leather sneakers feature premium full-grain leather construction, cushioned insoles, and a durable rubber outsole.',
  '/api/placeholder/800/800',
  ARRAY[39, 40, 41, 42, 43, 44],
  'Black'
),
(
  'Premium Running Shoes',
  249.00,
  'Engineered for performance and comfort. These premium running shoes feature advanced cushioning technology, breathable mesh upper, and a responsive sole.',
  '/api/placeholder/800/800',
  ARRAY[39, 40, 41, 42, 43, 44],
  'Blue'
),
(
  'Elegant Dress Shoes',
  299.00,
  'Sophisticated style for formal occasions. Crafted from premium Italian leather, these elegant dress shoes feature a refined oxford design.',
  '/api/placeholder/800/800',
  ARRAY[39, 40, 41, 42, 43, 44],
  'Black'
),
(
  'Casual Canvas Sneakers',
  149.00,
  'Comfortable and versatile everyday sneakers. Made from durable canvas material with a flexible rubber sole, these casual sneakers offer all-day comfort.',
  '/api/placeholder/800/800',
  ARRAY[39, 40, 41, 42, 43, 44],
  'White'
)
ON CONFLICT DO NOTHING;
