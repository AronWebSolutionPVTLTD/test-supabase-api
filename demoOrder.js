// demoOrders.js
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase client
const supabaseUrl = 'https://pksthahvrdrjlnwfjaxl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc3RoYWh2cmRyamxud2ZqYXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjI2MDksImV4cCI6MjA3NDE5ODYwOX0.emt4UP5_a_YfmJjYSBvUmA8cP3mwW1Tkf7GYNoGySjE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Test user credentials
// const testUserEmail = 'test@malinator.com';
// const testUserPassword = 'Qwerty@123';

const testUserEmail = "demouser@mailinator.com";
const testUserPassword = "Qwerty@123";

async function demoRLS() {
    try {
        console.log('--- Fetching orders as anonymous user ---');
        const { data: anonOrders, error: anonError } = await supabase
            .from('orders')
            .select('*');

        if (anonError) console.error('Anonymous fetch error:', anonError);
        else console.log('Anonymous fetch result:', anonOrders); // should be []

        console.log('\n--- Signing in test user ---');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: testUserEmail,
            password: testUserPassword
        });

        if (signInError) {
            console.error('Sign-in error:', signInError);
            return;
        }

        const userJwt = signInData.session.access_token;
        console.log('USER_JWT_TOKEN:', userJwt);

        console.log('\n--- Fetching orders as authenticated user ---');
        // Create a new Supabase client with the user's JWT
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${userJwt}` } },
        });

        const { data: userOrders, error: userError } = await supabaseAuth
            .from('orders')
            .select('*');

        if (userError) console.error('Authenticated fetch error:', userError);
        else console.log('Authenticated fetch result:', userOrders);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// Run the demo
demoRLS();
