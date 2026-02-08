'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '@/app/actions/orders';
import { ShoppingBag, Lock, CheckCircle } from 'lucide-react';
export default function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const closeCart = useCartStore((s) => s.closeCart);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');

  const TUNISIAN_GOVERNORATES = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kebili', 'Kef', 'Mahdia', 'Manouba', 'Medenine',
    'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse',
    'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan'
  ];

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      name.trim().length >= 2 &&
      phone.trim().length >= 8 &&
      street.trim().length >= 5 &&
      city.trim().length >= 2 &&
      governorate !== ''
    );
  }, [items.length, name, phone, street, city, governorate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    closeCart();

    const fullAddress = `${street.trim()}, ${city.trim()}, ${governorate}`;

    startTransition(async () => {
      const res = await createOrder({
        customer_name: name.trim(),
        phone: phone.trim(),
        address: fullAddress,
        total_price: Number(total.toFixed(2)),
        items: items,
      });

      if (!res.success) {
        setError(res.error ?? 'Failed to place order.');
        return;
      }

      clearCart();
      router.push(`/checkout/success?orderId=${res.data?.orderId}`);
    });
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-[#d4af37]/20 p-12 bg-gradient-to-br from-white to-[#d4af37]/5 text-center"
      >
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2
          className="text-2xl font-bold text-[#001f3f] mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-6">Add premium products before checking out.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Go to Shop
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onSubmit={onSubmit}
        className="lg:col-span-3 rounded-2xl border-2 border-[#d4af37]/20 p-8 bg-white shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-lg">
            <Lock className="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h2
              className="text-3xl font-bold text-[#001f3f]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Checkout
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Enter your details to complete your order
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-[#001f3f] mb-2">
              Full Name <span className="text-[#d4af37]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-[#001f3f] mb-2">
              Phone Number <span className="text-[#d4af37]">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
              placeholder="Ex: 55 123 456"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#001f3f] mb-2">
              Street Address <span className="text-[#d4af37]">*</span>
            </label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
              placeholder="House number and street name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#001f3f] mb-2">
                City <span className="text-[#d4af37]">*</span>
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors"
                placeholder="City name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#001f3f] mb-2">
                Governorate <span className="text-[#d4af37]">*</span>
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full rounded-lg border-2 border-[#d4af37]/30 px-4 py-3 outline-none focus:border-[#d4af37] transition-colors bg-white appearance-none"
                required
              >
                <option value="" disabled>Select governorate</option>
                {TUNISIAN_GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border-2 border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!canSubmit || isPending}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] rounded-lg font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Place Order • {total.toFixed(2)} TND
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 rounded-2xl border-2 border-[#d4af37]/20 p-6 bg-gradient-to-br from-[#001f3f] to-[#003366] text-white h-fit shadow-xl"
      >
        <h3
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Order Summary
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.lineId} className="flex justify-between gap-3 pb-4 border-b border-white/20">
              <div className="min-w-0">
                <p className="font-semibold truncate">{item.name} × {item.quantity}</p>
                {(item.size || item.color) && (
                  <p className="text-sm text-white/70 mt-1">
                    {item.size ? `Size ${item.size}` : ''}
                    {item.size && item.color ? ' • ' : ''}
                    {item.color ?? ''}
                  </p>
                )}
              </div>
              <p className="text-[#d4af37] font-bold whitespace-nowrap">
                {(item.price * item.quantity).toFixed(2)} TND
              </p>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t-2 border-[#d4af37]/30 flex justify-between items-center">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-3xl font-bold text-[#d4af37]">{total.toFixed(2)} TND</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
