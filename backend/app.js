import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from 'cors'
import { errorMiddleware } from "./middleware/err.js";
import userRouter from './routes/userRoute.js'
import shellRouter from './routes/shellRoute.js'


config({
  path: '.env'
})

export const app = express();

// Middleware to parse JSON bodies
app.use(express.json());


// If you need to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}))


app.get('/', (req, res) => {
  res.send('Hello from backend... \n Server is running properly!')
})


app.use('/api/v1/users', userRouter)
app.use('/api/v1/shells', shellRouter)

app.use(errorMiddleware)