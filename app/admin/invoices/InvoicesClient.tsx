'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Download, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
    id: string;
    customer_name: string;
    phone: string;
    total_price: number;
    created_at: string;
    status: string;
    shipping_address?: string;
    items?: any[];
}

interface InvoicesClientProps {
    orders: Order[];
}

export default function InvoicesClient({ orders }: InvoicesClientProps) {
    const { t, isRTL } = useLanguage();

    const generatePDF = (order: Order) => {
        const doc = new jsPDF();

        // Brand Header (Mock Logo)
        doc.setFillColor(17, 24, 39); // Luxe Navy
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(249, 201, 77); // Luxe Gold
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('LuxeShopy', 105, 20, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Premium Luxury Footwear', 105, 28, { align: 'center' });

        // Invoice Info
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.text(t('invoices').toUpperCase(), 14, 60);

        doc.setFontSize(10);
        doc.text(`${t('invoiceId')}: #${order.id.slice(0, 8).toUpperCase()}`, 14, 70);
        doc.text(`${t('date')}: ${new Date(order.created_at).toLocaleDateString()}`, 14, 75);

        // Customer Info
        doc.text('Bill To:', 140, 70);
        doc.setFont('helvetica', 'bold');
        doc.text(order.customer_name || 'N/A', 140, 75);
        doc.setFont('helvetica', 'normal');
        doc.text(order.phone || '', 140, 80);

        // Items Table
        const tableBody = [
            // Assuming simplified mock items if none exist, normally we map order.items
            ['Premium Footwear Product', '1', `${order.total_price.toFixed(2)} TND`, `${order.total_price.toFixed(2)} TND`]
        ];

        autoTable(doc, {
            startY: 90,
            head: [[t('items'), t('quantity'), t('unitPrice'), t('amount')]],
            body: tableBody,
            headStyles: { fillColor: [10, 10, 10], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 90 },
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${t('totalPrice')}: ${order.total_price.toFixed(2)} TND`, 140, finalY);

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150);
        doc.text('Thank you for choosing LuxeShopy. Experience Excellence.', 105, 280, { align: 'center' });

        doc.save(`Invoice_${order.id.slice(0, 8)}.pdf`);
    };

    return (
        <div className="space-y-6 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
            <h1 className="text-3xl font-bold text-[#001f3f]">{t('invoices')}</h1>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#001f3f] text-white">
                            <tr>
                                <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('invoiceId')}</th>
                                <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('customerName')}</th>
                                <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('date')}</th>
                                <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('amount')}</th>
                                <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, i) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4 font-mono text-sm text-gray-500">#{order.id.slice(0, 8)}</td>
                                    <td className="p-4 font-medium text-[#001f3f]">{order.customer_name}</td>
                                    <td className="p-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-[#d4af37]">{order.total_price.toFixed(2)} TND</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => generatePDF(order)}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-[#001f3f] hover:text-[#d4af37] text-gray-600 rounded-lg transition-all text-sm font-semibold"
                                        >
                                            <Download className="w-4 h-4" />
                                            {t('downloadInvoice')}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
