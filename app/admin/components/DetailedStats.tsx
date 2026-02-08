'use client';

import { motion } from 'framer-motion';
import { Package, DollarSign } from 'lucide-react';

interface StatsRowProps {
    label: string;
    value: string;
    isLast?: boolean;
}

function StatsRow({ label, value, isLast }: StatsRowProps) {
    return (
        <div className={`flex items-center justify-between py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="font-bold text-[#001f3f]">{value}</span>
        </div>
    );
}

export default function DetailedStats({ orders = [] }: { orders: any[] }) {
    // Helper to filter orders by date range
    const filterByDate = (days: number) => {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - days);
        return orders.filter(o => new Date(o.created_at) >= pastDate);
    };

    // Helper to check if date is today
    const isToday = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    // Helper to check if date was yesterday
    const isYesterday = (dateString: string) => {
        const date = new Date(dateString);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
    };

    const calculateEarnings = (filteredOrders: any[]) => {
        return filteredOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);
    };

    // Orders Breakdown
    const ordersToday = orders.filter(o => isToday(o.created_at));
    const ordersYesterday = orders.filter(o => isYesterday(o.created_at));
    const ordersWeek = filterByDate(7);
    const ordersMonth = filterByDate(30);
    const ordersYear = filterByDate(365);

    const orderBreakdown = [
        { label: 'Today', value: ordersToday.length.toString() },
        { label: 'Yesterday', value: ordersYesterday.length.toString() },
        { label: 'This week', value: ordersWeek.length.toString() },
        { label: 'This month', value: ordersMonth.length.toString() },
        { label: 'This year', value: ordersYear.length.toString() },
        { label: 'All time', value: orders.length.toString() },
    ];

    // Earnings Breakdown
    const earningBreakdown = [
        { label: 'Today', value: `TND ${calculateEarnings(ordersToday).toFixed(3)}` },
        { label: 'Yesterday', value: `TND ${calculateEarnings(ordersYesterday).toFixed(3)}` },
        { label: 'This week', value: `TND ${calculateEarnings(ordersWeek).toFixed(3)}` },
        { label: 'This month', value: `TND ${calculateEarnings(ordersMonth).toFixed(3)}` },
        { label: 'This year', value: `TND ${calculateEarnings(ordersYear).toFixed(3)}` },
        { label: 'All time', value: `TND ${calculateEarnings(orders).toFixed(3)}` },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <Package className="w-5 h-5 text-[#001f3f]" />
                    <h3 className="font-bold text-[#001f3f]">Orders</h3>
                </div>
                <div className="p-4">
                    {orderBreakdown.map((item, idx) => (
                        <StatsRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            isLast={idx === orderBreakdown.length - 1}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Earnings Panel */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-[#001f3f]" />
                    <h3 className="font-bold text-[#001f3f]">Earnings</h3>
                </div>
                <div className="p-4">
                    {earningBreakdown.map((item, idx) => (
                        <StatsRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            isLast={idx === earningBreakdown.length - 1}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
