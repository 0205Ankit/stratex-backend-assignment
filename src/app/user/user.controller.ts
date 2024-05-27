import { Request, Response } from "express";
import errorResponse from "../../helpers/response";
import { StatusCodes } from "http-status-codes";
import logger from "../../helpers/logger";
import prisma from "../../prisma";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export default class UserController {
  static async getAllBooks(req: Request, res: Response) {
    try {
      const books = await prisma.books.findMany();
      if (!books) {
        return errorResponse(res, "Books not found", StatusCodes.NOT_FOUND);
      }
      return res.status(StatusCodes.OK).json({
        message: "Books fetched successfully",
        books: books,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  static async getBookById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const book = await prisma.books.findUnique({
        where: {
          id: id,
        },
      });
      if (!book) {
        return errorResponse(res, "Book not found", StatusCodes.NOT_FOUND);
      }
      return res.status(StatusCodes.OK).json({
        message: "Book fetched successfully",
        book: book,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
