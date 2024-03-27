import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/chat').catch(error => console.log(error));

app.use('/api/users', userRouter);

app.listen(port);
