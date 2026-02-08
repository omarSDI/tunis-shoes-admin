'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart, TrendingUp } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Product } from '@/lib/types';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 15) + 1);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
    });
    openCart();
  };

  const isLimitedStock = Math.random() > 0.7; // 30% chance

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative"
      >
        <Link
          href={`/products/${product.id}`}
          className="block bg-white rounded-2xl overflow-hidden border-2 border-[#d4af37]/20 hover:border-[#d4af37] transition-all duration-300 shadow-lg hover:shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container with Hover Zoom */}
          <div className="relative w-full h-80 bg-gradient-to-br from-[#001f3f]/5 to-[#d4af37]/5 overflow-hidden">
            {product.image_url ? (
              <motion.img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isLimitedStock && (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                  Limited Stock
                </span>
              )}
              {product.category && (
                <span className="px-3 py-1 bg-[#001f3f] text-[#d4af37] text-xs font-semibold rounded-full capitalize">
                  {product.category}
                </span>
              )}
            </div>

            {/* Viewers Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
              <TrendingUp className="w-3 h-3 text-[#d4af37]" />
              <span className="text-xs font-semibold text-[#001f3f]">
                {viewers} viewing
              </span>
            </div>

            {/* Quick View Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              className="absolute inset-0 bg-[#001f3f]/80 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickView(true);
                }}
                className="px-6 py-3 bg-[#d4af37] text-[#001f3f] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#d4af37]/90 transition-colors shadow-lg"
              >
                <Eye className="w-5 h-5" />
                Quick View
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3
                className="text-xl font-bold text-[#001f3f] mb-2 line-clamp-1"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {product.title}
              </h3>
              {product.color && (
                <p className="text-sm text-gray-600">Color: {product.color}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#d4af37] mb-1">
                  {product.price.toFixed(2)} TND
                </p>
                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Sizes: {product.sizes.slice(0, 3).join(', ')}
                    {product.sizes.length > 3 && '...'}
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart Button with Magnet Effect */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#d4af37] text-white hover:text-[#001f3f] rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </motion.button>
          </div>
        </Link>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
