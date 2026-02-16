'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllOrders } from '../../actions/orders';

export default function NotificationBell() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const orders = await getAllOrders();
        const pending = orders.filter((o) => o.status === 'pending').length;
        setPendingCount(pending);

        // Pulse animation if there are new pending orders
        if (pending > 0) {
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 2000);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchPendingOrders();
    // Poll every 30 seconds for new orders
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <div className="relative">
          <Bell className="w-5 h-5 text-[#d4af37]" />
          {pendingCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ${isPulsing ? 'animate-pulse' : ''
                }`}
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </motion.span>
          )}
        </div>
        <span className="text-white font-semibold">
          {pendingCount > 0
            ? `${pendingCount} Pending Order${pendingCount > 1 ? 's' : ''}`
            : 'No New Orders'}
        </span>
      </motion.button>
    </div>
  );
}
