import { JwtPayload, verify } from 'jsonwebtoken';
import { errorHandler } from './error';
import { NextFunction, Request, Response } from 'express';

// Extend Express Request interface to include `user` property
declare global {
    namespace Express {
        interface Request {
            user?: JWTUser;
        }
    }
}

// Define a custom interface for your JWT payload
interface JWTUser extends JwtPayload {
    id: number;
    // Add any other fields you include in your JWT
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, "Please login to access this resource"));
    }
    try {
        // Use synchronous verify method with type assertion
        const decoded = verify(token, process.env.JWT_SECRET as string) as JWTUser;
        
        // Ensure the decoded token has the required properties
        if (!decoded || !decoded.id) {
            return next(errorHandler(401, "Invalid token"));
        }
        
        req.user = decoded;
        next();
    } catch (err) {
        // Handle verification errors (expired token, invalid signature, etc.)
        return next(errorHandler(401, "Unauthorized"));
    }
}