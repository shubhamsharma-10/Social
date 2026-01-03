import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { generateToken } from "../utils/token.util.js";
import { UserPayload } from "../utils/types.util.js";

const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { email, username, displayName, password } = req.body;

            const existingEmail = await prisma.user.findUnique({
                where: { email } 
            });

            if (existingEmail) {
                return res.status(400).json({
                    status: false,
                    message: "Email already in use"
                });
            }

            const existingUsername =  await prisma.user.findUnique({
                where: { username }
            });

            if (existingUsername) {
                return res.status(400).json({
                    status: false,
                    message: "Username already in use"
                });
            }
            const hashedPassword = await bcrypt.hash(password, config.salt_rounds)
            const newUser = await prisma.user.create({
                data: {
                    email,
                    username,
                    displayName,
                    password: hashedPassword
                }
            })

            const tokens = generateToken({
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            })
        
            const ans  = await prisma.session.create({
                data :{
                    userId: newUser.id,
                    refresh_token: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })

            console.log("Session Created: ", ans);

            res.status(201).json({
                status: true,
                message: "User registered successfully",
                data: tokens
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Server error",
                error
            });
        }
    },

    login: async(req: Request, res: Response) => {
        try {
            const {email, password} = req.body;
            const user = await prisma.user.findUnique({
                where: { email }
            });
            console.log("Found User: ", user);
            if(!user) {
                throw new Error("Invalid credential");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                throw new Error("Invalid credential");
            }

            const tokens = generateToken({
                id: user.id,
                email: user.email,
                username: user.username
            })

            const ans  = await prisma.session.create({
                data:{
                    userId: user.id,
                    refresh_token: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })
            console.log("Session Created: ", ans);

            res.status(200).json({
                status: true,
                message: "Login successful",
                data: tokens
            });

        } catch (error) {
            console.log("Login Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error   
            });
        }
    },

    refresh: async(req: Request, res: Response) => {
        const { refresh_token } = req.body;
        try {
            const validToken = jwt.verify(refresh_token, config.refresh_token_secret as jwt.Secret) as UserPayload;
            if(! validToken) {
                throw new Error("Invalid refresh token")
            }

            const sessionExist = await prisma.session.findUnique({
                where: { refresh_token }
            })

            if(!sessionExist){
                throw new Error("Refresh token not found")
            }
            const tokens = generateToken({
                id: validToken.id,
                email: validToken.email,
                username: validToken.username
            })

            await prisma.session.update({
                where: { id: sessionExist.id},
                data: {
                    refresh_token: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            })

            res.status(200).json({
                status: true,
                message: "Token refreshed successfully",
                data: tokens
            })
        } catch (error) {
            res.status(401).json({
                status: false,
                error: error instanceof Error ?  error.message : error
            })
        }
    },

    getMe: async (req: Request, res: Response) => {
       try {
         // @ts-ignore
         const userId = req.userId;
         const user = await prisma.user.findUnique({
             where: { id: userId },
             select: {
                 id: true,
                 email: true,
                 username: true,
                 displayName: true,
             }
         })
 
         res.status(200).json({
             status: true,
             data: user
         })
       } catch (error) {
            console.log("Get Me Error: ", error);
            res.status(500).json({
                status: false,
                message: "Server error",
                error
            });
       }

    },

    logout: async(req: Request, res: Response) => {
        const { refresh_token } = req.body;
        try {
           const ans = await prisma.session.deleteMany({
                where: { refresh_token }
            });
            console.log("Logout Deletion Result: ", ans);
            res.status(200).json({
                status: true,
                message: "Logout successful"
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: "Server error",
                error
            });
        }
    }
}

export default authController;