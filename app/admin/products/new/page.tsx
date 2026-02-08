import ProductForm from '../components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Add New Product</h1>
        <p className="mt-2 text-gray-600">Create a new product for your store</p>
      </div>

      <ProductForm />
    </div>
  );
}
