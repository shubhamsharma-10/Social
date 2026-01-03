import { Router } from "express";
import { prisma } from "../config/db.js";
import { Request, Response } from "express";

const feedRouter = Router();

// Public feed - no authentication required
feedRouter.get('/', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true
                    }
                }
            }
        });

        const total = await prisma.post.count();

        res.status(200).json({
            status: true,
            message: "Feed fetched successfully",
            data: {
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.log("Get Feed Error: ", error);
        res.status(500).json({
            status: false,
            error: error instanceof Error ? error.message : error
        });
    }
});

// Get single post by ID - public
feedRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const postId = req.params.id;

        const post = await prisma.post.findUnique({
            where: { id: postId as string },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true
                    }
                }
            }
        });

        if (!post) {
            return res.status(404).json({
                status: false,
                message: "Post not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Post fetched successfully",
            data: post
        });
    } catch (error) {
        console.log("Get Post Error: ", error);
        res.status(500).json({
            status: false,
            error: error instanceof Error ? error.message : error
        });
    }
});

export default feedRouter;
