'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

interface AdminRealtimeContextType {
    pendingCount: number;
    notifications: any[];
    unreadCount: number;
    unreadNotificationCount: number;
    markAllRead: () => void;
    resetNotificationCount: () => void;
}

const AdminRealtimeContext = createContext<AdminRealtimeContextType | undefined>(undefined);

export function AdminRealtimeProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

    const fetchPendingCount = async () => {
        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (!countError && count !== null) {
            setPendingCount(count);
        }

        // Fetch latest 5 orders for notification dropdown
        const { data: latestOrders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (!ordersError && latestOrders) {
            setNotifications(latestOrders.map(o => ({
                id: o.id,
                title: 'Order Tracking',
                message: `Order from ${o.customer_name || 'Guest'} - ${Number(o.total_price).toFixed(2)} TND`,
                read: true,
                time: new Date(o.created_at)
            })));
        }
    };

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error('Sound error', e);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchPendingCount();

        // Real-time subscription
        const channel = supabase
            .channel('admin-dashboard')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'orders',
                },
                (payload: any) => {
                    console.log('Realtime update:', payload);

                    if (payload.eventType === 'INSERT') {
                        setPendingCount((prev) => prev + 1);
                        setUnreadNotificationCount((prev) => prev + 1);
                        const newOrder = payload.new;
                        toast.success(`New Order: ${(newOrder as any).total_price} TND`, {
                            icon: <Bell className="w-4 h-4 text-green-500" />
                        });
                        setNotifications(prev => [{
                            id: newOrder.id,
                            title: 'New Order',
                            message: `Order received from ${newOrder.customer_name || 'Guest'}`,
                            read: false,
                            time: new Date()
                        }, ...prev].slice(0, 10)); // Keep last 10
                        playNotificationSound();
                        router.refresh();
                    } else if (payload.eventType === 'UPDATE') {
                        fetchPendingCount();
                        router.refresh();
                    } else if (payload.eventType === 'DELETE') {
                        fetchPendingCount();
                        router.refresh();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const resetNotificationCount = () => {
        setUnreadNotificationCount(0);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AdminRealtimeContext.Provider value={{
            pendingCount,
            notifications,
            unreadCount,
            unreadNotificationCount,
            markAllRead,
            resetNotificationCount
        }}>
            {children}
        </AdminRealtimeContext.Provider>
    );
}

export function useAdminRealtime() {
    const context = useContext(AdminRealtimeContext);
    if (context === undefined) {
        throw new Error('useAdminRealtime must be used within a AdminRealtimeProvider');
    }
    return context;
}
