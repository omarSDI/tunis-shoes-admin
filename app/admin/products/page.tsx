import Link from 'next/link';
import { getProducts } from '../../actions/products';
import { Plus } from 'lucide-react';
import ProductTable from './components/ProductTable';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Products
          </h1>
          <p className="text-gray-600 text-lg">Manage your luxury product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#001f3f] to-[#001f3f] hover:from-[#d4af37] hover:to-[#b8941e] text-white hover:text-[#001f3f] rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add New Product
        </Link>
      </div>

      <ProductTable products={products} />
    </div>
  );
}
