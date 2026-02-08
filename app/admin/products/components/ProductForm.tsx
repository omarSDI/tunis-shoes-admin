'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createProduct, updateProduct } from '@/app/actions/products';
import { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

interface ProductFormProps {
  product?: Product;
}

const AVAILABLE_SIZES = [39, 40, 41, 42, 43, 44];
const CATEGORIES = ['Men', 'Women', 'Kids'];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: product?.price || 0,
    description: product?.description || '',
    category: product?.category || '',
    sizes: product?.sizes || [],
    image_url: product?.image_url || '',
    color: product?.color || '',
    cost_price: (product as any)?.cost_price || 0,
    compare_at_price: (product as any)?.compare_at_price || 0,
    image_type: (product as any)?.image_type || 'url',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');

  const handleSizeToggle = (size: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFormData(prev => ({ ...prev, image_type: 'upload' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || formData.price <= 0 || formData.sizes.length === 0) {
      toast.error(t('fillRequired'));
      return;
    }

    // Check image
    if (formData.image_type === 'url' && !formData.image_url) {
      toast.error(t('provideUrl'));
      return;
    }
    if (formData.image_type === 'upload' && !imageFile && !imagePreview) {
      toast.error(t('selectImage'));
      return;
    }

    startTransition(async () => {
      let finalImageUrl = formData.image_url;

      try {
        // Handle Image Upload
        if (formData.image_type === 'upload' && imageFile) {
          const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
          const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, imageFile);

          if (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image: ' + error.message);
          }

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          finalImageUrl = publicUrl;
        } else if (formData.image_type === 'upload' && !imageFile && imagePreview) {
          // Keeping existing image in upload mode
          finalImageUrl = imagePreview;
        }

        const productData = {
          ...formData,
          image_url: finalImageUrl,
        };

        if (product) {
          const result = await updateProduct({
            id: product.id,
            ...productData,
          });
          if (result.success) {
            toast.success(t('productUpdated'));
            router.push('/admin/products');
          } else {
            toast.error(result.error || t('failedUpdate'));
          }
        } else {
          const result = await createProduct(productData);
          if (result.success) {
            toast.success(t('productCreated'));
            router.push('/admin/products');
          } else {
            toast.error(result.error || t('failedCreate'));
          }
        }
      } catch (err: any) {
        toast.error(err.message || 'An error occurred');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-[#d4af37]/20 p-8 shadow-xl"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-[#001f3f] mb-2">
            {t('productTitle')} <span className="text-[#d4af37]">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
            placeholder="e.g., Nike Air Max"
            required
          />
        </div>

        {/* Pricing Section */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
          <h3 className="text-[#001f3f] font-bold text-lg flex items-center gap-2">
            {t('priceInventory')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#001f3f] mb-2">
                {t('productPrice')} (TND) <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors bg-white"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001f3f] mb-2">
                {t('productComparePrice')} (TND)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.compare_at_price}
                onChange={(e) =>
                  setFormData({ ...formData, compare_at_price: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors bg-white"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Original price for discount display</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001f3f] mb-2">
                {t('productCostPrice')} (TND)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors bg-white"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">For profit calculation (Hidden)</p>
            </div>
          </div>
        </div>

        {/* Media Management - Dual System */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-[#001f3f] font-bold text-lg mb-4 flex items-center gap-2">
            Media Management
          </h3>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image_type: 'upload' })}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${formData.image_type === 'upload'
                ? 'bg-[#001f3f] text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Upload className="w-4 h-4" /> Local Upload
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, image_type: 'url' })}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${formData.image_type === 'url'
                ? 'bg-[#001f3f] text-white shadow-lg'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <LinkIcon className="w-4 h-4" /> Internet Link
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Area */}
            <div className="space-y-4">
              {formData.image_type === 'upload' ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#d4af37] transition-colors cursor-pointer bg-white h-full min-h-[200px]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-700">Click to upload image</p>
                  <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      className="flex-1 rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Paste a direct link to an image from the web.</p>
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Live Preview</p>
              <div className="aspect-square rounded-xl overflow-hidden border-2 border-[#d4af37]/20 bg-white shadow-sm flex items-center justify-center relative group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Invalid+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium">Product Image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-[#001f3f] mb-2">
            {t('productDescription')}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors resize-none"
            placeholder="Product description... (Markdown supported)"
          />
        </div>

        {/* Category & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-[#001f3f] mb-2">
              Category <span className="text-[#d4af37]">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat.toLowerCase()}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#001f3f] mb-2">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
              placeholder="e.g., Black/White"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-semibold text-[#001f3f] mb-3">
            Available Sizes <span className="text-[#d4af37]">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_SIZES.map((size) => (
              <motion.button
                key={size}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSizeToggle(size)}
                className={`px-5 py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${formData.sizes.includes(size)
                  ? 'border-[#d4af37] bg-[#d4af37] text-[#001f3f] shadow-lg'
                  : 'border-[#d4af37]/30 text-[#001f3f] hover:border-[#d4af37] hover:bg-[#d4af37]/10'
                  }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
          {formData.sizes.length === 0 && (
            <p className="mt-2 text-sm text-red-600">Please select at least one size</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t-2 border-[#d4af37]/20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="px-8 py-4 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] rounded-lg font-bold transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl"
          >
            {isPending
              ? product
                ? 'Updating...'
                : 'Creating...'
              : product
                ? 'Update Product'
                : 'Create Product'}
          </motion.button>
          <Link
            href="/admin/products"
            className="px-8 py-4 border-2 border-[#d4af37]/30 rounded-lg hover:bg-[#d4af37]/10 transition-colors font-semibold text-[#001f3f]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
