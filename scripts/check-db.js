const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function check() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('URL:', url);
    console.log('Key length:', key?.length);

    const supabase = createClient(url, key);

    console.log('Testing connection to orders table...');
    const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Orders Query Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Orders found:', count);

        const { data: cols, error: colError } = await supabase
            .from('orders')
            .select('*')
            .limit(1);

        if (cols && cols.length > 0) {
            console.log('Columns in orders:', Object.keys(cols[0]));
        }
    }
}

check();
