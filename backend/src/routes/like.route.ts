import { Router } from "express";
import likeController from "../controllers/like.controller.js";
import authMiddleware from "../middileware/auth.middleware.js";

const likeRouter = Router();

likeRouter.use(authMiddleware);

likeRouter.post('/:postId', likeController.toggleLike);
likeRouter.get('/:postId', likeController.checkLikes);

export default likeRouter;