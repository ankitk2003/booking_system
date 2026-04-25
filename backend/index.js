import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes.js';
import workerRouter from './routes/workerRoutes.js';
import customerRouter from './routes/customerRoutes.js';
import cors from 'cors';
const app = express();
const PORT = 3000;  
dotenv.config();


const allowedOrigins = [
  'http://localhost:5173',
  'https://collabsphereai.vercel.app',
  'https://access-hub-2-1tx4.onrender.com',
  'https://access-hub-silk.vercel.app'
];


app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/worker", workerRouter);
app.use("/api/customer", customerRouter);


mongoose
  .connect(process.env.MONGO_URI )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.get('/', (req, res) => {
  res.send('Hello, from the test route!');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
