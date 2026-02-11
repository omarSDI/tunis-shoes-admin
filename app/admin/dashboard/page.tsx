export const dynamic = 'force-dynamic';

import { getDashboardStats, getSalesChartData } from '@/app/actions/admin';
import { getAllOrders } from '../../actions/orders';
import DashboardClient from './DashboardClient';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const chartData = await getSalesChartData();
  const recentOrders = await getAllOrders();

  return (
    <DashboardClient
      stats={stats}
      chartData={chartData}
      recentOrders={recentOrders}
    />
  );
}
