import { getAllOrders } from '../../actions/orders';
import InsightsClient from './InsightsClient';

export default async function InsightsPage() {
    const orders = await getAllOrders();
    const serializedOrders = orders.map(o => ({
        ...o,
        phone: o.phone || '',
        customer_name: o.customer_name || 'Unknown'
    }));

    return <InsightsClient orders={serializedOrders} />;
}
