import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middileware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schema/auth.schema.js';
import authMiddleware from '../middileware/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register)
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/me', authMiddleware, authController.getMe);

export default authRouter;