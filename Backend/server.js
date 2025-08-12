import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import problemRoutes from './routes/problems.js';
import connectdb from './config/db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Use Express's built-in JSON parser

connectdb();

app.use('/api/problems', problemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));