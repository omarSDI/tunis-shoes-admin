'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopClientProps {
    products: Product[];
}

export default function ShopClient({ products }: ShopClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    const categories = ['All', 'Men', 'Women', 'Accessories', 'New Arrivals'];

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // 1. Search filter (Primary)
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(p => {
                const title = (p.title || '').toLowerCase();
                const description = (p.description || '').toLowerCase();
                const category = (p.category || '').toLowerCase();
                const color = (p.color || '').toLowerCase();
                const id = String(p.id || '').toLowerCase();

                return title.includes(query) ||
                    description.includes(query) ||
                    category.includes(query) ||
                    color.includes(query) ||
                    id.includes(query);
            });
        }

        // 2. Category filter (Secondary)
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        // 3. Sort
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, searchQuery, selectedCategory, sortBy]);

    // Check if search would return results in other categories
    const resultsInOtherCategories = useMemo(() => {
        if (!searchQuery || selectedCategory === 'All') return 0;

        const query = searchQuery.toLowerCase().trim();
        return products.filter(p => {
            const matchesSearch = (p.title || '').toLowerCase().includes(query) ||
                (p.description || '').toLowerCase().includes(query) ||
                (p.category || '').toLowerCase().includes(query) ||
                (p.color || '').toLowerCase().includes(query) ||
                String(p.id || '').toLowerCase().includes(query);
            return matchesSearch && p.category?.toLowerCase() !== selectedCategory.toLowerCase();
        }).length;
    }, [products, searchQuery, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            {/* Filter Bar */}
            <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg p-4 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for luxury footwear..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#d4af37]/20 outline-none text-[#001f3f] font-medium transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-[#001f3f] text-[#d4af37] shadow-md'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="h-8 w-px bg-gray-200 hidden md:block mx-2"></div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-50 text-[#001f3f] text-sm font-bold py-2.5 px-4 rounded-lg outline-none cursor-pointer hover:bg-gray-100 transition-colors border-none focus:ring-2 focus:ring-[#d4af37]/20"
                    >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {filteredProducts.map((product, index) => (
                            <ProductCard key={product.id} product={product} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
                    >
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <SlidersHorizontal className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#001f3f] mb-2">No items found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mb-6">
                            We couldn't find any products matching your current filters.
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            {resultsInOtherCategories > 0 && (
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className="px-6 py-3 bg-[#001f3f] text-[#d4af37] rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
                                >
                                    Show {resultsInOtherCategories} results in other categories
                                </button>
                            )}

                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="text-sm font-bold text-gray-400 hover:text-[#d4af37] transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
