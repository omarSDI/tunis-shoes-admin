import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartSidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CheckoutForm />
      </div>
    </div>
  );
}

