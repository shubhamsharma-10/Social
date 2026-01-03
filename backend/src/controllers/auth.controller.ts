import { Request, Response } from "express";
import { prisma } from "../config/db.js";
import bcrypt from 'bcrypt';
import config from "../config/config.js";
import { generateToken } from "../utils/token.util.js";

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

            const token = generateToken(newUser.id);

            res.status(201).json({
                status: true,
                message: "User registered successfully",
                token
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
            const token = generateToken(user.id);

            res.status(200).json({
                status: true,
                message: "Login successful",
                token
            });

        } catch (error) {
            console.log("Login Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error   
            });
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

    }
}

export default authController;