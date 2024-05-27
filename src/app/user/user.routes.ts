import { Router } from "express";
import UserController from "./user.controller";
import userMiddleware from "../../middlewares/user.middleware";

const userRouter = Router();

userRouter.get("/books", userMiddleware, UserController.getAllBooks);
userRouter.get("/book/:id", userMiddleware, UserController.getBookById);

export default userRouter;
