import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verifyJwt } from "../helpers/jwt";
import prisma from "../prisma";

export default async function sellerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization || " ";

  if (token) {
    try {
      const { userId } = verifyJwt(token);
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || user.role === "USER") {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
      }

      req.currentUser = user;
      return next();
    } catch (err) {
      return res.status(StatusCodes.UNAUTHORIZED);
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
}
