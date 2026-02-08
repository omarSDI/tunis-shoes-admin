import { getAllOrders } from '../../actions/orders';
import InvoicesClient from './InvoicesClient';

export default async function InvoicesPage() {
    const orders = await getAllOrders();
    const serializedOrders = orders.map(o => ({
        ...o,
        phone: o.phone || '',
        customer_name: o.customer_name || 'Unknown'
    }));

    return <InvoicesClient orders={serializedOrders} />;
}
