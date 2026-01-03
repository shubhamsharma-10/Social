import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token){
            throw new Error("Unauthorized access")
        }
    
        const validToken = jwt.verify(token, config.jwt_secret as jwt.Secret);
        console.log("Verified Token: ", validToken);
        if(!validToken){
            throw new Error("Unauthorized access")
        }   
        // @ts-ignore
        req.userId = validToken.id;
        next();
    } catch (error) {
        console.log("Auth Middleware Error: ", error);
        return res.status(401).json({
            status: false,
            error: error instanceof Error ? error.message: error
        });
    }
}

export default authMiddleware;