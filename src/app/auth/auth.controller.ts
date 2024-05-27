import { Request, Response } from "express";
import { createUserSchema, signinUserSchema } from "./auth.schema";
import errorResponse from "../../helpers/response";
import { StatusCodes } from "http-status-codes";
import { signJwt } from "../../helpers/jwt";
import logger from "../../helpers/logger";
import bcrypt from "bcrypt";
import prisma from "../../prisma";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export default class AuthController {
  static async SignUp(req: Request, res: Response) {
    const { email, username, password, is_seller } = req.body;

    const { error } = createUserSchema.safeParse(req.body);

    if (error) {
      return res.sendStatus(StatusCodes.BAD_REQUEST).json(error.message);
    }

    try {
      const userExist = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (userExist) {
        return errorResponse(res, "Email already in use", StatusCodes.CONFLICT);
      }

      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username,
          password: await bcrypt.hash(password, 10),
          role: is_seller ? "SELLER" : "USER",
        },
      });

      const access_token = signJwt(
        {
          userId: newUser.id.toString(),
        },
        {
          expiresIn: "30d",
        }
      );

      return res.status(StatusCodes.CREATED).json({
        newUser,
        access_token,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  static async SignIn(req: Request, res: Response) {
    const { error } = signinUserSchema.safeParse(req.body);
    const errorMessage = "Invalid Credentials!";

    if (error) {
      return res.json(error.message);
    }

    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      const isPasswordValid = await bcrypt.compare(
        password,
        user?.password ?? ""
      );

      if (!user || !isPasswordValid) {
        return errorResponse(res, errorMessage, StatusCodes.UNAUTHORIZED);
      }

      const access_token = signJwt(
        {
          userId: user.id.toString(),
        },
        {
          expiresIn: "30d",
        }
      );

      const { password: pass, ...resUser } = user;

      return res.status(StatusCodes.OK).json({
        user: resUser,
        access_token,
      });
    } catch (err) {
      logger.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  static async currentUser(req: Request, res: Response) {
    const { currentUser } = req;

    if (!currentUser) {
      return res.sendStatus(401);
    }

    return res.json(currentUser);
  }
}
