import { Request, Response } from "express";
import { prisma } from "../config/db.js";

const likeController = {
    toggleLike: async (req: Request, res: Response) => {
        try {
            const { postId } = req.params;
            // @ts-ignore
            const userId = req.userId;

            const existingLike = await prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId: postId as string
                    }
                }
            })

            if (existingLike) {
                await prisma.like.delete({
                    where: {
                        id: existingLike.id
                    }
                })
                await prisma.post.update({
                    where: {
                        id: postId as string
                    },
                    data: {
                        likeCount: {
                            decrement: 1
                        }
                    }
                })

                return res.status(200).json({
                    status: true,
                    message: "Like removed successfully"
                })
            } else {

                await prisma.like.create({
                    data: {
                        userId, postId: postId as string
                    }
                })

                await prisma.post.update({
                    where: {
                        id: postId as string
                    },
                    data: {
                        likeCount: {
                            increment: 1
                        }
                    }
                })

                return res.status(200).json({
                    status: true,
                    message: "Like added successfully"
                })

            }
        } catch (error) {
            console.log("Toggle Like Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    },

    checkLikes: async (req: Request, res: Response) => {
        try {
            const postId = req.params.postId;
            // @ts-ignore
            const userId = req.userId;

            const likeExist = await prisma.like.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId: postId as string
                    }
                }
            })

            res.status(200).json({
                status: true,
                liked: likeExist ? true : false
            })
        } catch (error) {
            console.log("Check Likes Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }

    }
}

export default likeController;