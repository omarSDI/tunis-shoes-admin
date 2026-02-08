import { getAllOrders } from '../../actions/orders';
import RecentOrdersTable from '../components/RecentOrdersTable';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#001f3f] mb-2"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Orders
        </h1>
        <p className="text-gray-600 text-lg">Manage and track all customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#d4af37]/20 shadow-xl overflow-hidden">
        <RecentOrdersTable orders={orders} showAll />
      </div>
    </div>
  );
}
