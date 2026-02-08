'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

export default function ProductGrid({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-[#d4af37]/5 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-12 w-64 mx-auto mb-16 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full bg-gradient-to-b from-white to-[#d4af37]/5 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#001f3f] text-center mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Featured Collection
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">No products available</p>
              <p className="text-gray-400 text-sm">Check back soon for our latest collection</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-[#d4af37]/5 py-20 md:py-32 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Featured Collection
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">
            Discover our curated selection of premium footwear
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
