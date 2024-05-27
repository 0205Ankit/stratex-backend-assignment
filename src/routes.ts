import { Router } from "express";
import authRoutes from "./app/auth/auth.routes";
import sellerRoutes from "./app/seller/seller.routes";
import userRoutes from "./app/user/user.routes";

const globalRouter = Router();

globalRouter.use("/auth", authRoutes);
globalRouter.use("/seller", sellerRoutes);
globalRouter.use("/user", userRoutes);

export default globalRouter;
