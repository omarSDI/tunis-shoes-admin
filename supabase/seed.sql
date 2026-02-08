-- Seed data for products table
INSERT INTO products (id, name, price, description, images, colors, sizes) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Classic Leather Sneakers',
  199.00,
  'Timeless elegance meets modern comfort. These classic leather sneakers feature premium full-grain leather construction, cushioned insoles, and a durable rubber outsole. Perfect for everyday wear, they combine style with exceptional durability. The handcrafted design ensures a perfect fit and long-lasting quality.',
  ARRAY['/api/placeholder/800/800'],
  ARRAY['Black', 'White', 'Brown'],
  ARRAY[39, 40, 41, 42, 43, 44]
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Premium Running Shoes',
  249.00,
  'Engineered for performance and comfort. These premium running shoes feature advanced cushioning technology, breathable mesh upper, and a responsive sole designed for optimal energy return. Whether you''re hitting the track or the trails, these shoes provide the support and comfort you need for your best run.',
  ARRAY['/api/placeholder/800/800'],
  ARRAY['Black', 'Blue', 'Red'],
  ARRAY[39, 40, 41, 42, 43, 44]
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Elegant Dress Shoes',
  299.00,
  'Sophisticated style for formal occasions. Crafted from premium Italian leather, these elegant dress shoes feature a refined oxford design, leather-lined interior, and a polished finish. The classic silhouette and meticulous attention to detail make these the perfect choice for business meetings, weddings, and special events.',
  ARRAY['/api/placeholder/800/800'],
  ARRAY['Black', 'Brown'],
  ARRAY[39, 40, 41, 42, 43, 44]
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Casual Canvas Sneakers',
  149.00,
  'Comfortable and versatile everyday sneakers. Made from durable canvas material with a flexible rubber sole, these casual sneakers offer all-day comfort and style. Perfect for weekend outings, casual Fridays, or just relaxing around town. The lightweight design and breathable material keep your feet comfortable in any weather.',
  ARRAY['/api/placeholder/800/800'],
  ARRAY['White', 'Navy', 'Gray'],
  ARRAY[39, 40, 41, 42, 43, 44]
)
ON CONFLICT (id) DO NOTHING;
