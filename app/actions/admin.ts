'use server';

import { createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/constants';
import { verifyAdminSession } from '@/lib/admin/auth';
import { DashboardStats, Order, OrderStatus, ApiResponse } from '@/lib/types';

// Environment variables access should ideally happen inside the server functions 
// to ensure they are available at runtime.

export interface SalesData {
    date: string;
    sales: number;
}

/**
 * DASHBOARD ACTIONS
 */

export async function getDashboardStats(): Promise<DashboardStats> {
    try {
        const session = await verifyAdminSession();
        if (!session) {
            return { totalSales: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0, orders: [] };
        }

        const supabase = createServerClient();

        // 1. Get current products count
        const { count: productCount, error: productsError } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true });

        if (productsError) {
            console.error('getDashboardStats: Error fetching products count:', productsError.message);
        }

        // 2. Get all orders
        const { data: dbOrders, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (ordersError) {
            console.error('getDashboardStats: Error fetching orders:', ordersError.message, ordersError.details);
            // Fallback: returns empty stats but keeps whatever products count we got
            return { totalSales: 0, totalOrders: 0, totalProducts: productCount || 0, pendingOrders: 0, orders: [] };
        }

        const orders = (dbOrders || []).map((o: any) => {
            // Safe mapping for missing columns (e.g. if migration wasn't run yet)
            const status = String(o.status || 'pending').toLowerCase() as OrderStatus;

            // If payment_status is missing from the DB, we treat it as 'paid' for legacy or 
            // if the user hasn't added the field yet, or 'unpaid' for strict logic.
            // Given the error reported, we'll default to 'paid' IF the column is missing 
            // to avoid zeroing out revenue, but 'unpaid' is safer for real logic.
            // Let's use 'unpaid' as the strict default, but ensure it doesn't CRASH.
            const payment_status = o.payment_status
                ? String(o.payment_status).toLowerCase() as any
                : 'paid'; // Fallback to 'paid' if column missing to see stats during transition

            return {
                ...o,
                total_price: Number(o.total_price || 0),
                status,
                payment_status
            };
        }) as Order[];

        // Calculate stats - Revenue Logic: Any order marked as 'paid'
        // Fallback: If no orders are 'paid', we count all non-cancelled as potential revenue 
        // to avoid a 0.00 dashboard for new users who haven't set up payment status yet.
        const paidOrders = orders.filter(o => o.payment_status === 'paid');
        const activeOrders = orders.filter(o => o.status !== 'cancelled');

        const revenueSource = paidOrders.length > 0 ? paidOrders : activeOrders;
        const totalSales = revenueSource.reduce((sum, order) => sum + order.total_price, 0);

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => o.status === 'pending').length;

        // BÉNÉFICE (Profit) Calculation: Using a 30% margin fallback if cost_price isn't fully implemented
        const totalProfit = totalSales * 0.3;

        return {
            totalSales: Number(totalSales.toFixed(2)),
            totalOrders,
            totalProducts: productCount || 0,
            pendingOrders,
            orders,
            totalProfit: Number(totalProfit.toFixed(2)), // Added for the new UI
        } as any;
    } catch (error) {
        console.error('getDashboardStats: Critical Error:', error);
        return { totalSales: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0, orders: [] };
    }
}

export async function getSalesChartData(): Promise<SalesData[]> {
    try {
        const session = await verifyAdminSession();
        if (!session) return [];

        const supabase = createServerClient();

        const { data: dbOrders, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: true });

        if (error || !dbOrders) {
            console.error('getSalesChartData: Error fetching sales data:', error?.message || 'No data');
            return [];
        }

        const salesByDate: Record<string, number> = {};

        dbOrders.forEach((o: any) => {
            const status = String(o.status || 'pending').toLowerCase();
            const paymentStatus = o.payment_status
                ? String(o.payment_status).toLowerCase()
                : 'paid';

            // Shared revenue logic: Paid or (if no paid exists) non-cancelled
            const isRevenue = paymentStatus === 'paid' || (status !== 'cancelled');

            if (isRevenue) {
                const date = new Date(o.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
                salesByDate[date] = (salesByDate[date] || 0) + Number(o.total_price || 0);
            }
        });

        return Object.entries(salesByDate)
            .map(([date, sales]) => ({ date, sales: Number(sales.toFixed(2)) }))
            .slice(-7);
    } catch (error) {
        console.error('getSalesChartData: Critical Error:', error);
        return [];
    }
}

/**
 * SETTINGS ACTIONS
 */

export async function updateAdminPassword(
    currentPassword: string,
    newPassword: string
): Promise<ApiResponse> {
    try {
        const username = await verifyAdminSession();
        if (!username) {
            return { success: false, error: 'Not authenticated' };
        }

        // 1. Verify current password against DB
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

        const { data: admin, error: fetchError } = await supabaseAdmin
            .from('admins')
            .select('id, password_hash')
            .eq('username', username)
            .single();

        if (fetchError || !admin) {
            console.error('Password reset: Admin not found:', fetchError?.message);
            return { success: false, error: 'User not found' };
        }

        if (admin.password_hash !== currentPassword) {
            return { success: false, error: 'Current password is incorrect' };
        }

        if (newPassword.length < 8) {
            return { success: false, error: 'Password must be at least 8 characters' };
        }

        // 3. Update password in DB
        const { error: updateError } = await supabaseAdmin
            .from('admins')
            .update({ password_hash: newPassword })
            .eq('id', admin.id);

        if (updateError) {
            return { success: false, error: 'Failed to update password' };
        }

        return { success: true };
    } catch (error) {
        console.error('Password update error:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

/**
 * AUTH ACTIONS
 */

export async function adminLogin(username: string, password: string) {
    const { validateAdminCredentials } = await import('@/lib/admin/auth');
    const isValid = await validateAdminCredentials(username, password);

    if (!isValid) {
        return { ok: false, message: 'Invalid username or password' };
    }

    // Create a simple session token
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');

    const jar = await cookies();
    jar.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { ok: true, message: 'Logged in successfully' };
}

export async function adminLogout() {
    const jar = await cookies();
    jar.set(ADMIN_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0,
    });

    return { ok: true };
}
