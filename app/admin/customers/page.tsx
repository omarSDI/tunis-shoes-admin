import { getAllOrders } from '../../actions/orders';
import CustomersClient from './CustomersClient';

export default async function CustomersPage() {
    const orders = await getAllOrders();
    // Serialize to ensure types match what Client expects (null -> empty string or handle in client)
    const serializedOrders = orders.map(o => ({
        ...o,
        phone: o.phone || '',
        customer_name: o.customer_name || 'Unknown'
    }));

    return <CustomersClient orders={serializedOrders} />;
}
