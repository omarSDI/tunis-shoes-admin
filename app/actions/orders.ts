'use server';

import { createServerClient } from '@/lib/supabase/server';
import { Order, OrderStatus, ApiResponse, CreateOrderInput } from '@/lib/types';
import { verifyAdminSession } from '@/lib/admin/auth';
import { revalidatePath } from 'next/cache';

export async function createOrder(
  input: CreateOrderInput
): Promise<ApiResponse<{ orderId: string }>> {
  try {
    const supabase = createServerClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: input.customer_name,
        phone: input.phone,
        address: input.address,
        total_price: input.total_price,
        items: input.items,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return { success: false, error: orderError.message };
    }

    if (!order) {
      return { success: false, error: 'Failed to create order' };
    }

    return { success: true, data: { orderId: order.id } };
  } catch (error) {
    console.error('Failed to create order:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error.message, error.details);
      return [];
    }

    return (data as Order[]) ?? [];
  } catch (e) {
    console.error('Failed to fetch orders:', e);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const supabase = createServerClient();

    // Validate status
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled', 'paid'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return { success: false, error: 'Invalid status' };
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status: status.toLowerCase() })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      console.error('No order found with ID:', orderId);
      return { success: false, error: 'Order not found or update failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string): Promise<ApiResponse> {
  try {
    const session = await verifyAdminSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus.toLowerCase() })
      .eq('id', orderId)
      .select();

    if (error) {
      console.error('Error updating payment status:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update payment status:', error);
    return { success: false, error: 'Internal server error' };
  }
}
