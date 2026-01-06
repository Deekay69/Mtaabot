import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chat.js';
import webhookRoutes from './routes/webhooks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Webhook route needs raw body for verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Normal routes use JSON
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Basic Route
app.get('/', (req, res) => {
    res.send('MtaaBot Backend API is running.');
});

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
