import Navbar from '../../components/Navbar';
import CartSidebar from '../../components/CartSidebar';
import ProductGrid from '../../components/ProductGrid';
import TrustSignals from '../../components/TrustSignals';
import { getProducts } from '@/app/actions/products';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const normalized = name?.toLowerCase();

  const products =
    normalized === 'men' || normalized === 'women'
      ? await getProducts(normalized)
      : await getProducts();

  const title =
    normalized === 'men'
      ? "Men's Collection"
      : normalized === 'women'
        ? "Women's Collection"
        : 'Category';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">
            Curated picks for {normalized === 'men' ? 'him' : normalized === 'women' ? 'her' : 'you'}.
          </p>
        </div>
      </div>
      <ProductGrid products={products} />
      <TrustSignals />
      <CartSidebar />
    </div>
  );
}
