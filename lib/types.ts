export interface Product {
    id: string;
    title: string;
    price: number;
    description: string | null;
    image_url: string | null;
    sizes: number[] | null;
    color: string | null;
    category?: string | null;
    cost_price?: number;
    compare_at_price?: number;
    image_type?: 'url' | 'upload';
    created_at?: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
export type PaymentStatus = 'paid' | 'unpaid';

export interface Order {
    id: string;
    customer_name: string;
    phone: string | null;
    address: string | null;
    total_price: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    items?: any[]; // For future expansion
}

export interface Customer {
    name: string;
    phone: string;
    address?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrder: string;
    isPaid: boolean; // Derived from their order history
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
    pendingOrders: number;
    orders: Order[];
    totalProfit: number;
}

export interface CreateProductInput {
    title: string;
    price: number;
    description: string;
    category: string;
    sizes: number[];
    image_url: string;
    color?: string;
    cost_price?: number;
    compare_at_price?: number;
    image_type?: 'url' | 'upload';
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
    id: string;
}

export interface CreateOrderInput {
    customer_name: string;
    phone: string;
    address: string;
    total_price: number;
    items: any[];
}
