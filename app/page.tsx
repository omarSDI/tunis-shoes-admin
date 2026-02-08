import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import TrustSignals from './components/TrustSignals';
import AdminSeedButton from './components/AdminSeedButton';
import { getProducts } from './actions/products';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-end">
          <AdminSeedButton />
        </div>
      </div>
      <ProductGrid products={products} />
      <TrustSignals />
      <CartSidebar />
    </div>
  );
}
