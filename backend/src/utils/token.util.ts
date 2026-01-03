import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { UserPayload } from './types.util.js';

export const generateToken = (payload: UserPayload) => {
   const accessToken = jwt.sign(
            payload, 
            config.access_token_secret as jwt.Secret,
            { expiresIn: '15m' }
        );
    console.log("Generated Access Token: ", accessToken);
    
    const refreshToken = jwt.sign(
            payload, 
            config.refresh_token_secret as jwt.Secret,
            { expiresIn: '7d' }
        );
    console.log("Generated Refresh Token: ", refreshToken);
    return { accessToken, refreshToken };
}

