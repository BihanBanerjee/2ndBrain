import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express'
import authRoutes from './routes/auth.route';
import contentRoutes from './routes/content.route';
import brainRoutes from './routes/brain.route';
interface CustomError extends Error {
    statusCode?: number
}


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/brain', brainRoutes);

app.use((err: CustomError, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Interal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});