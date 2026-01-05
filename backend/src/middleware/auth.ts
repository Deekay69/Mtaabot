import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export interface AuthRequest extends Request {
    auth?: {
        userId: string;
        orgId?: string;
        role?: string;
    };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the JWT with Clerk
        const decoded = await clerkClient.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.auth = {
            userId: decoded.sub,
            orgId: decoded.org_id as string | undefined,
            role: decoded.org_role as string | undefined
        };

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export const requireOrg = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.auth?.orgId) {
        return res.status(403).json({ error: 'Organization (Business) context required' });
    }
    next();
};
