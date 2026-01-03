import { Router } from "express";
import upload from "../middileware/upload.multer.js";
import postController from "../controllers/post.controller.js";
import authMiddleware from "../middileware/auth.middleware.js";

const postRouter = Router();

postRouter.use(authMiddleware)

postRouter.post('/', upload.single('image'), postController.createPost)
postRouter.get('/', postController.getPosts)
postRouter.get('/:id', postController.getPostById)
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id', postController.updatePost)

export default postRouter