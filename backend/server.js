require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db'); // triggers Supabase connection

// Import Routes
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Import Global Logger
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();

// 1. Security & Core Middlewares
app.use(helmet()); 

// ENTERPRISE CORS: Replace with your actual Vercel Frontend URL once deployed
app.use(cors({
    origin: true, // This automatically allows whichever Vercel URL you are using
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// 2. ROOT ROUTE (Fixes Vercel 404 on the home page)
app.get('/', (req, res) => {
    res.json({ message: "Kristallball API is Live" });
});

// 3. Logging Middleware
app.use('/api', loggerMiddleware);

// 4. Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);

// Health Check for monitoring
app.get('/health', (req, res) => res.send('Kristallball Command API: Online'));

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Command Error' });
});

// 6. Start Server Logic
const PORT = process.env.PORT || 5000;

/**
 * CRITICAL FOR VERCEL DEPLOYMENT:
 * We ONLY call app.listen() if we are running locally.
 * In production (Vercel), we export the app instead.
 */
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`-----------------------------------------------`);
        console.log(`KRISTALLBALL LOCAL STARTING ON PORT ${PORT}`);
        console.log(`-----------------------------------------------`);
    });
}

// THIS EXPORTS THE APP FOR VERCEL TO HANDLE AS A SERVERLESS FUNCTION
module.exports = app;