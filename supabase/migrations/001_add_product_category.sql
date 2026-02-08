-- Add product category for /category/[name] filtering
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Optional index
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

