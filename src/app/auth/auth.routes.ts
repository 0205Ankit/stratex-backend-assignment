import { Router } from "express";
import AuthController from "./auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", AuthController.SignUp);
authRouter.post("/sign-in", AuthController.SignIn);

export default authRouter;
