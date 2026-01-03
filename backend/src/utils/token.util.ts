import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (id: string) => {
    const token = jwt.sign({ id }, config.jwt_secret as jwt.Secret)
    console.log("Generated Token: ", token);
    return token;
}

