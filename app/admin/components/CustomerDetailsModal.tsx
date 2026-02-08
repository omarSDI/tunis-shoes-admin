'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShoppingBag, DollarSign, Download, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { updatePaymentStatus } from '@/app/actions/orders';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Order, Customer } from '@/lib/types';

interface CustomerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer | null;
    orders: Order[];
}

export default function CustomerDetailsModal({ isOpen, onClose, customer, orders }: CustomerDetailsModalProps) {
    const { t, isRTL } = useLanguage();
    const router = useRouter();

    if (!customer) return null;

    const customerOrders = orders.filter(o =>
        (o.phone === customer.phone) || (o.customer_name === customer.name)
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const handleTogglePayment = async (orderId: string, currentStatus?: string) => {
        const newStatus = currentStatus?.toLowerCase() === 'paid' ? 'unpaid' : 'paid';
        const result = await updatePaymentStatus(orderId, newStatus);
        if (result.success) {
            toast.success(`Payment updated to ${newStatus.toUpperCase()}`);
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to update payment');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 31, 63); // #001f3f
        doc.text('Customer Transaction Report', 105, 20, { align: 'center' });

        // Brand
        doc.setFontSize(10);
        doc.setTextColor(212, 175, 55); // #d4af37
        doc.text('TUNIS SHOES - LUXURY COLLECTION', 105, 28, { align: 'center' });

        // Customer Info
        doc.setDrawColor(212, 175, 55);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Customer: ${customer.name}`, 20, 45);
        doc.text(`Phone: ${customer.phone || 'N/A'}`, 20, 52);
        doc.text(`Total Orders: ${customer.totalOrders}`, 20, 59);
        doc.text(`Total Spent: ${customer.totalSpent.toFixed(2)} TND`, 20, 66);
        doc.text(`Date Exported: ${new Date().toLocaleDateString()}`, 190, 45, { align: 'right' });

        // Table
        const tableData = customerOrders.map(order => [
            new Date(order.created_at).toLocaleDateString(),
            `#${order.id.slice(0, 8)}`,
            order.status || 'N/A',
            order.payment_status?.toUpperCase() || 'UNPAID',
            `${Number(order.total_price).toFixed(2)} TND`
        ]);

        autoTable(doc, {
            startY: 75,
            head: [['Date', 'Order ID', 'Status', 'Payment', 'Amount']],
            body: tableData,
            headStyles: { fillColor: [0, 31, 63], textColor: [212, 175, 55] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 75 }
        });

        doc.save(`${customer.name.replace(/\s+/g, '_')}_Report.pdf`);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#001f3f]/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d4af37]/20"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#d4af37] rounded-2xl flex items-center justify-center text-[#001f3f] font-bold text-xl shadow-inner">
                                    {customer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{customer.name}</h2>
                                    <p className="text-[#d4af37] text-sm font-medium tracking-wide">Premium Customer</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto">
                            {/* Left Column: Summary */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 divide-y divide-gray-200">
                                    <div className="pb-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Contact Information</h3>
                                        <div className="space-y-4">
                                            <a href={`tel:${customer.phone}`} className="flex items-center gap-3 text-[#001f3f] hover:text-[#d4af37] transition-colors">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold">{customer.phone || 'Not available'}</span>
                                            </a>
                                            <div className="flex items-center gap-3 text-[#001f3f]">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-sm">{customer.address || 'Tunisia (No Address)'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Customer Stats</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                                                <ShoppingBag className="w-5 h-5 text-[#d4af37] mx-auto mb-2" />
                                                <p className="text-xs text-gray-500 uppercase">Orders</p>
                                                <p className="text-xl font-bold text-[#001f3f]">{customer.totalOrders}</p>
                                            </div>
                                            <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                                                <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-2" />
                                                <p className="text-xs text-gray-500 uppercase">Spent</p>
                                                <p className="text-xl font-bold text-[#001f3f]">{customer.totalSpent.toFixed(0)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={exportToPDF}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#001f3f] text-[#d4af37] rounded-xl font-bold hover:bg-[#003366] transition-all shadow-lg active:scale-95"
                                >
                                    <Download className="w-5 h-5" />
                                    Export Account Statement
                                </button>
                            </div>

                            {/* Right Column: Order History */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-xl font-bold text-[#001f3f] flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-[#d4af37]" />
                                    Transaction History
                                </h3>
                                <div className="space-y-3">
                                    {customerOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-[#d4af37]/30 transition-all shadow-sm group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#001f3f]/5 rounded-lg flex items-center justify-center text-[#001f3f] group-hover:bg-[#d4af37]/10 transition-colors">
                                                    <ShoppingBag className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#001f3f]">Order #{order.id.slice(0, 8)}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                                        <span className="text-gray-300">|</span>
                                                        <button
                                                            onClick={() => handleTogglePayment(order.id, order.payment_status)}
                                                            className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md transition-all ${order.payment_status?.toLowerCase() === 'paid'
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-700 hover:bg-red-200 animate-pulse'
                                                                }`}
                                                        >
                                                            {order.payment_status?.toLowerCase() === 'paid' ? (
                                                                <><CheckCircle2 className="w-3 h-3" /> Payé</>
                                                            ) : (
                                                                <><AlertCircle className="w-3 h-3" /> Non Payé</>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#001f3f]">{Number(order.total_price).toFixed(2)} TND</p>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                                                    order.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>
                                                    {order.status || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
