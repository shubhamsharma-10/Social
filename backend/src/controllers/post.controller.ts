import { Request, Response } from "express";
import { uploadImage } from "../utils/upload.util.js";
import { prisma } from "../config/db.js";

const postController = {
    createPost: async (req: Request, res: Response) => {
        try {
            const { content } = req.body;
            const file = req.file;
            // @ts-ignore
            const authorId = req.userId;
            console.log("Author Id: ", authorId);
            console.log("File: ", file);
            console.log("Content: ", content);

            if (!content) {
                throw new Error("Content is required");
            }

            if (!file) {
                throw new Error("Image is required");
            }

            const imageUrl = await uploadImage(authorId, file.buffer);

            const newPost = await prisma.post.create({
                data: {
                    content,
                    imageUrl,
                    authorId
                }
            })

            res.status(200).json({
                status: true,
                message: "Post created successfully",
                data: newPost
            })

        } catch (error) {
            console.log("Create Post Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    },

    getPosts: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const skip = (page - 1) * limit;
            // @ts-ignore
            const userId = req.userId;
            const posts = await prisma.post.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    authorId: userId
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
            })

            res.status(200).json({
                status: true,
                message: "Posts fetched successfully",
                data: posts
            })
        } catch (error) {
            console.log("Get Posts Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    },

    getPostById: async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            // @ts-ignore
            const authorId = req.userId
            const post = await prisma.post.findUnique({
                where: {
                    id: postId as string,
                    authorId: authorId as string
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
            })
            if (!post) {
                throw new Error("Post not found")
            }
            res.status(200).json({
                status: true,
                message: "Post fetched successfully",
                data: post
            })
        } catch (error) {
            console.log("Get Post By Id Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    },

    deletePost: async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            // @ts-ignore
            const authorId = req.userId
            const post = await prisma.post.findUnique({
                where: {
                    id: postId as string,
                    authorId: authorId as string
                }
            })
            if (!post) {
                throw new Error("Post not found")
            }
            await prisma.post.delete({
                where: {
                    id: postId as string
                }
            })
            res.status(200).json({
                status: true,
                message: "Post deleted successfully",
                data: post
            })
        } catch (error) {
            console.log("Delete Post Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    },

    updatePost: async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            // @ts-ignore
            const authorId = req.userId
            const post = await prisma.post.findUnique({
                where: {
                    id: postId as string,
                    authorId: authorId as string
                }
            })
            if (!post) {
                throw new Error("Post not found")
            }
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId as string
                },
                data: {
                    content: req.body.content
                }
            })
            res.status(200).json({
                status: true,
                message: "Post updated successfully",
                data: updatedPost
            })
        } catch (error) {
            console.log("Update Post Error: ", error);
            res.status(500).json({
                status: false,
                error: error instanceof Error ? error.message : error
            })
        }
    }
}

export default postController;