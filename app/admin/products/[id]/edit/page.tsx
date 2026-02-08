import { getProductById } from '../../../../actions/products';
import { redirect } from 'next/navigation';
import ProductForm from '../../components/ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    redirect('/admin/products');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Edit Product</h1>
        <p className="mt-2 text-gray-600">Update product information</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
