import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
