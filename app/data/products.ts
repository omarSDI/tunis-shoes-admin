export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: string[];
  sizes: number[];
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Leather Sneakers',
    price: 199,
    description: 'Timeless elegance meets modern comfort. These classic leather sneakers feature premium full-grain leather construction, cushioned insoles, and a durable rubber outsole. Perfect for everyday wear, they combine style with exceptional durability. The handcrafted design ensures a perfect fit and long-lasting quality.',
    images: ['/api/placeholder/800/800'],
    colors: ['Black', 'White', 'Brown'],
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 2,
    name: 'Premium Running Shoes',
    price: 249,
    description: 'Engineered for performance and comfort. These premium running shoes feature advanced cushioning technology, breathable mesh upper, and a responsive sole designed for optimal energy return. Whether you\'re hitting the track or the trails, these shoes provide the support and comfort you need for your best run.',
    images: ['/api/placeholder/800/800'],
    colors: ['Black', 'Blue', 'Red'],
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 3,
    name: 'Elegant Dress Shoes',
    price: 299,
    description: 'Sophisticated style for formal occasions. Crafted from premium Italian leather, these elegant dress shoes feature a refined oxford design, leather-lined interior, and a polished finish. The classic silhouette and meticulous attention to detail make these the perfect choice for business meetings, weddings, and special events.',
    images: ['/api/placeholder/800/800'],
    colors: ['Black', 'Brown'],
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 4,
    name: 'Casual Canvas Sneakers',
    price: 149,
    description: 'Comfortable and versatile everyday sneakers. Made from durable canvas material with a flexible rubber sole, these casual sneakers offer all-day comfort and style. Perfect for weekend outings, casual Fridays, or just relaxing around town. The lightweight design and breathable material keep your feet comfortable in any weather.',
    images: ['/api/placeholder/800/800'],
    colors: ['White', 'Navy', 'Gray'],
    sizes: [39, 40, 41, 42, 43, 44],
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id);
}
