'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useLanguage } from '@/app/context/LanguageContext';
import { motion } from 'framer-motion';
import { Search, Download, Phone, ShoppingBag, DollarSign } from 'lucide-react';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import { Order, Customer } from '@/lib/types';

interface CustomersClientProps {
    orders: Order[];
}

export default function CustomersClient({ orders }: CustomersClientProps) {
    const { t, isRTL } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Process orders to get unique customers
    const customers = React.useMemo(() => {
        const customerMap = new Map<string, Customer>();

        orders.forEach(order => {
            const key = order.phone || order.customer_name;
            if (!key) return;

            const existing = customerMap.get(key);
            const orderPaid = order.payment_status?.toLowerCase() === 'paid';

            if (existing) {
                existing.totalOrders += 1;
                existing.totalSpent += Number(order.total_price);
                existing.isPaid = existing.isPaid && orderPaid;
                if (new Date(order.created_at) > new Date(existing.lastOrder)) {
                    existing.lastOrder = order.created_at;
                    existing.address = order.address || existing.address;
                }
            } else {
                customerMap.set(key, {
                    name: order.customer_name || 'Unknown',
                    phone: order.phone || '',
                    address: order.address || '',
                    totalOrders: 1,
                    totalSpent: Number(order.total_price),
                    lastOrder: order.created_at,
                    isPaid: orderPaid
                });
            }
        });

        return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    }, [orders]);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const exportToExcel = () => {
        const data = customers.map(c => ({
            [t('customerName')]: c.name,
            [t('phoneNumber')]: c.phone,
            [t('totalOrders')]: c.totalOrders,
            [t('totalSpent')]: c.totalSpent,
            'Payment': c.isPaid ? 'Paid' : 'Unpaid',
            'Last Order': new Date(c.lastOrder).toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Customers");
        XLSX.writeFile(wb, "TunisShoes_Customers.xlsx");
    };

    return (
        <div className="space-y-6 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-[#001f3f]">{t('customers')}</h1>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-6 py-3 bg-[#001f3f] text-[#d4af37] rounded-xl hover:bg-[#003366] transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <Download className="w-5 h-5" />
                    {t('exportExcel')}
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                    type="text"
                    placeholder={t('search') + "..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 focus:border-[#d4af37] outline-none transition-all shadow-sm ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
                />
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#001f3f] text-white">
                            <tr>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('customerName')}</th>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('phoneNumber')}</th>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('totalOrders')}</th>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('totalSpent')}</th>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'الخلاص' : 'Payment'}</th>
                                <th className={`p-4 font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer, index) => (
                                <motion.tr
                                    key={customer.phone + index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors group"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#001f3f] font-bold">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-[#001f3f]">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {customer.phone ? (
                                            <a
                                                href={`tel:${customer.phone}`}
                                                className="flex items-center gap-2 text-gray-600 hover:text-[#d4af37] transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                <span dir="ltr">{customer.phone}</span>
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                                            {customer.totalOrders}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 font-bold text-[#001f3f]">
                                            <DollarSign className="w-4 h-4 text-[#d4af37]" />
                                            {customer.totalSpent.toFixed(2)} TND
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border ${customer.isPaid
                                            ? 'bg-green-100 text-green-700 border-green-200'
                                            : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            {customer.isPaid ? 'Payé' : 'Non Payé'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleViewDetails(customer)}
                                            className="text-sm text-[#001f3f] hover:text-[#d4af37] font-medium underline decoration-wavy decoration-[#d4af37]/50"
                                        >
                                            {t('viewDetails')}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCustomers.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No customers found.
                        </div>
                    )}
                </div>
            </div>

            <CustomerDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                customer={selectedCustomer}
                orders={orders}
            />
        </div>
    );
}
