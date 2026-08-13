require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./config/db'); 

const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');
const loggerMiddleware = require('./middlewares/loggerMiddleware');

const app = express();

app.use(helmet()); 

// Updated CORS for Production
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Kristallball Command API is Live" });
});

app.use('/api', loggerMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);

app.get('/health', (req, res) => res.send('Online'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Command Error' });
});

// --- RENDER DEPLOYMENT LOGIC ---
const PORT = process.env.PORT || 5000;

// On Render, we MUST call listen, regardless of 'production' status
app.listen(PORT, '0.0.0.0', () => {
    console.log(`-----------------------------------------------`);
    console.log(`KRISTALLBALL API LIVE ON PORT ${PORT}`);
    console.log(`BINDING ADDRESS: 0.0.0.0`);
    console.log(`-----------------------------------------------`);
});

// Keep this export in case you ever want to move to Vercel later
module.exports = app;