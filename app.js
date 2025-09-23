require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ---- Routes ----

// 1. Get orders (supports optional JWT for authenticated fetch)
app.get('/orders', async (req, res) => {
  try {
    const userJwt = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

    let supabaseClient = supabase;
    if (userJwt) {
      // Create a Supabase client with user's JWT
      supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${userJwt}` } },
      });
    }

    const { data, error } = await supabaseClient.from('orders').select('*');
    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Health check
app.get('/', (req, res) => res.send('Supabase Orders API running!'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
