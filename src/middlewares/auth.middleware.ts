import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APIError } from '../utils/api-error.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
    };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new APIError(401, 'Access denied. No token provided.', []));
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.BETTER_AUTH_SECRET;

        if (!secret) {
            return next(new APIError(500, 'Auth secret is not defined on server', []));
        }

        try {
            const decoded = jwt.verify(token, secret) as any;
            if (!decoded || !decoded.sub) {
                return next(new APIError(401, 'Invalid or expired token payload', []));
            }

            req.user = {
                id: decoded.sub,
                email: decoded.email
            };
            next();
        } catch (err) {
            return next(new APIError(401, 'Invalid or expired token', []));
        }
    } catch (error) {
        next(error);
    }
};
