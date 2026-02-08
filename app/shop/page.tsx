import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import ShopClient from './ShopClient';
import TrustSignals from '../components/TrustSignals';
import { getProducts, seedExampleProducts } from '@/app/actions/products';

export default async function ShopPage() {
  let products = await getProducts();

  if (products.length === 0) {
    await seedExampleProducts();
    products = await getProducts();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Luxury Collection
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">
            Explore our latest drops and timeless essentials.
          </p>
        </div>
      </div>
      <ShopClient products={products} />
      <TrustSignals />
      <CartSidebar />
    </div>
  );
}
