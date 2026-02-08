'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X, Crown } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#d4af37]/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="h-8 w-32 skeleton rounded"></div>
            <div className="h-8 w-8 skeleton rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#d4af37]/30 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-2xl sm:text-3xl font-bold text-[#001f3f] hover:text-[#d4af37] transition-all duration-300"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4af37] group-hover:rotate-12 transition-transform" />
            <span>TunisShoes</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-10">
            {[
              { href: '/shop', label: t('shop') },
              { href: '/category/men', label: t('men') },
              { href: '/category/women', label: t('women') },
            ].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[#001f3f] hover:text-[#d4af37] transition-colors font-medium text-sm uppercase tracking-wider group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#d4af37] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Right Side - Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {/* Shopping Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <button
                onClick={toggleCart}
                className="relative p-3 text-[#001f3f] hover:text-[#d4af37] transition-colors rounded-full hover:bg-[#d4af37]/10"
                aria-label="Open shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#001f3f] shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#001f3f] hover:text-[#d4af37] transition-colors rounded-lg hover:bg-[#d4af37]/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 border-t border-[#d4af37]/20 pt-4 mt-2"
          >
            <div className="flex flex-col space-y-3">
              {[
                { href: '/shop', label: t('shop') },
                { href: '/category/men', label: t('men') },
                { href: '/category/women', label: t('women') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[#001f3f] hover:text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors font-medium rounded-lg uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
