'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle, ShoppingBag, Home, Printer } from 'lucide-react';
import Navbar from '../../components/Navbar';
import CartSidebar from '../../components/CartSidebar';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#d4af37', '#001f3f', '#b8941e'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#d4af37', '#001f3f', '#b8941e'],
      });
    }, 250);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <CartSidebar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#001f3f] to-[#003366]">
      <Navbar />
      <CartSidebar />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#d4af37] rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-[#d4af37] to-[#b8941e] rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-20 h-20 text-[#001f3f]" />
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Order Confirmed!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/80 mb-8"
          >
            Thank you for your purchase. Your order has been received and is being processed.
          </motion.p>

          {orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-[#d4af37]/30"
            >
              <p className="text-white/80 text-sm mb-2">Order ID</p>
              <p className="text-[#d4af37] font-mono font-bold text-lg">{orderId}</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941e] text-[#001f3f] rounded-lg font-bold hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-lg font-semibold hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#d4af37]/50 text-[#d4af37] rounded-lg font-semibold hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              <Printer className="w-5 h-5" />
              Print Invoice
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#001f3f] to-[#003366]">
        <Navbar />
        <CartSidebar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
