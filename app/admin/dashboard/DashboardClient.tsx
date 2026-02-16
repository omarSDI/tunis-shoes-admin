'use client';

import React, { useState, useMemo } from 'react';
import StatsCard from '../components/StatsCard';
import SalesChart from '../components/SalesChart';
import RecentOrdersTable from '../components/RecentOrdersTable';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { Order, OrderStatus } from '@/lib/types';

interface DashboardClientProps {
    stats: {
        totalProducts: number;
        orders: Order[];
        totalSales: number;
        totalProfit: number;
        pendingOrders: number;
    };
    chartData: any[];
    recentOrders: Order[];
}

export default function DashboardClient({ stats: initialStats, chartData: initialChartData, recentOrders: initialRecentOrders }: DashboardClientProps) {
    const { t } = useLanguage();
    const [orders, setOrders] = useState(initialRecentOrders);

    // Synchronize all stats from the orders state
    const derivedStats = useMemo(() => {
        // Shared revenue logic: Paid or non-cancelled
        const revenueSource = orders.filter(o =>
            o.payment_status?.toLowerCase() === 'paid' ||
            (o.status?.toLowerCase() !== 'cancelled' && o.status?.toLowerCase() !== 'pending')
        );

        const totalSales = revenueSource.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
        const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
        const totalProfit = totalSales * 0.3; // Fallback margin

        return {
            totalSales,
            totalOrders: orders.length,
            pendingOrders,
            totalProducts: initialStats.totalProducts,
            totalProfit,
            orders: orders
        };
    }, [orders, initialStats.totalProducts]);

    // Synchronize chart data from the orders state
    const derivedChartData = useMemo(() => {
        const salesByDate: Record<string, number> = {};

        orders.forEach((order) => {
            const status = order.status?.toLowerCase();
            const paymentStatus = order.payment_status?.toLowerCase();

            const isRevenue = paymentStatus === 'paid' || (status !== 'cancelled' && status !== 'pending');

            if (isRevenue) {
                const date = new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                salesByDate[date] = (salesByDate[date] || 0) + Number(order.total_price || 0);
            }
        });

        const sortedEntries = Object.entries(salesByDate)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, sales]) => ({ date, sales: Number(sales.toFixed(2)) }))
            .slice(-7);

        return sortedEntries.length > 0 ? sortedEntries : initialChartData;
    }, [orders, initialChartData]);

    const handleStatusUpdate = (orderId: string, newStatus: string) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus as OrderStatus } : order
        ));
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1
                        className="text-4xl font-extrabold text-[#001f3f] tracking-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {t('welcomeBack')}, <span className="text-[#c5a059]">Admin</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Here's what's happening today.</p>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatsCard
                    title="REVENU TOTAL"
                    value={`${derivedStats.totalSales.toFixed(2)} TND`}
                    icon={<DollarSign className="w-8 h-8" />}
                    bgIcon={<DollarSign />}
                    trend="+12.5%"
                />
                <StatsCard
                    title="BÉNÉFICE TOTAL"
                    value={`${derivedStats.totalProfit.toFixed(2)} TND`}
                    icon={<TrendingUp className="w-8 h-8" />}
                    bgIcon={<TrendingUp />}
                    trend="+8.2%"
                    variant="success"
                />
                <StatsCard
                    title={t('orders')}
                    value={derivedStats.totalOrders.toString()}
                    icon={<ShoppingBag className="w-8 h-8" />}
                    bgIcon={<ShoppingBag />}
                />
                <StatsCard
                    title={t('pending')}
                    value={derivedStats.pendingOrders.toString()}
                    icon={<Clock className="w-8 h-8" />}
                    bgIcon={<Clock />}
                    variant="warning"
                />
            </div>

            {/* Main Content: Chart and Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Sales Trend Chart Section */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2
                                className="text-3xl font-bold text-[#001f3f]"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Tendances des ventes
                            </h2>
                            <p className="text-gray-400 font-bold mt-1 uppercase tracking-widest text-xs">Derniers 7 jours</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <SalesChart data={derivedChartData} />
                    </div>
                </div>

                {/* Right Column: Inventory/Product overview or Quick Actions */}
                <div className="space-y-8">
                    <StatsCard
                        title={t('products')}
                        value={derivedStats.totalProducts.toString()}
                        icon={<Package className="w-8 h-8" />}
                        bgIcon={<Package />}
                    />

                    {/* Recent Orders Side Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/20 border border-gray-100">
                        <h2
                            className="text-xl font-bold text-[#001f3f] mb-6"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {t('recentOrders')}
                        </h2>
                        <div className="overflow-x-auto -mx-2">
                            <RecentOrdersTable
                                orders={orders.slice(0, 5)}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Comprehensive Table */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                    <h2
                        className="text-2xl font-bold text-[#001f3f]"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {t('allOrders')}
                    </h2>
                    <span className="px-4 py-2 bg-[#0a0a0a] text-white rounded-full text-xs font-bold">
                        {orders.length} TOTAL
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <RecentOrdersTable
                        orders={orders}
                        showAll
                        onStatusUpdate={handleStatusUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
