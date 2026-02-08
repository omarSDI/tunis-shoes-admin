-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS compare_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS image_type VARCHAR(50) DEFAULT 'url'; -- 'url' or 'upload'

-- Add comment to explain columns
COMMENT ON COLUMN products.cost_price IS 'Cost price for profit calculation';
COMMENT ON COLUMN products.compare_price IS 'Original price for discounts';
COMMENT ON COLUMN products.image_type IS 'Source of the product image: url or upload';
