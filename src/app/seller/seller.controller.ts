import { Request, Response } from "express";
import errorResponse from "../../helpers/response";
import { StatusCodes } from "http-status-codes";
import logger from "../../helpers/logger";
import prisma from "../../prisma";
import { User } from "@prisma/client";
import { book_entry_schema } from "./seller.schema";
import fs from "fs";
import csv from "csv-parser";

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export default class SellerController {
  static async addBookEntry(req: Request, res: Response) {
    const { title, author, publishedDate, price } = req.body;

    const { error } = book_entry_schema.safeParse(req.body);

    if (error) {
      return res.sendStatus(StatusCodes.BAD_REQUEST).json(error.message);
    }

    try {
      const newBook = await prisma.books.create({
        data: {
          title,
          author,
          publishedDate,
          price,
          sellerId: req.currentUser?.id,
        },
      });

      return res.status(StatusCodes.CREATED).json({
        message: "Book added successfully",
        book: newBook,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  static async addMultipleBooksEntry(req: Request, res: Response) {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "No files uploaded",
      });
    }

    const results: any[] = [];
    const filePath = Array.isArray(files)
      ? files[0].path
      : files[Object.keys(files)[0]][0].path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // adding sellerId to each book
        const updatedResults = results.map((result) => {
          return {
            ...result,
            sellerId: req.currentUser?.id,
          };
        });

        // create multiple books
        const books = await prisma.books.createMany({
          data: updatedResults,
        });

        res.status(StatusCodes.CREATED).json({
          message: "Books added successfully",
          books: books,
        });

        // delete the file after processing
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          }
        });
      })
      .on("error", (error) => {
        res.status(500).send(error.message);
      });
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  static async deleteBookEntry(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const book = await prisma.books.findUnique({
        where: {
          id: id,
          sellerId: req.currentUser?.id,
        },
      });

      if (!book) {
        return errorResponse(res, "Book not found", StatusCodes.NOT_FOUND);
      }

      const deletedBook = await prisma.books.delete({
        where: {
          id: id,
        },
      });
      return res.status(StatusCodes.OK).json({
        message: "Book deleted successfully",
        book: deletedBook,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  static async getMyBooks(req: Request, res: Response) {
    try {
      const books = await prisma.books.findMany({
        where: {
          sellerId: req.currentUser?.id,
        },
      });
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
          sellerId: req.currentUser?.id,
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

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  static async updateBookEntry(req: Request, res: Response) {
    const { id } = req.params;
    const { title, author, publishedDate, price } = req.body;

    const { error } = book_entry_schema.safeParse(req.body);
    const errorMessage = "Invalid Book Entry!";
    if (error) {
      return errorResponse(res, errorMessage, StatusCodes.BAD_REQUEST);
    }

    try {
      const book = await prisma.books.findUnique({
        where: {
          id: id,
          sellerId: req.currentUser?.id,
        },
      });
      if (!book) {
        return errorResponse(res, "Book not found", StatusCodes.NOT_FOUND);
      }

      const updatedBook = await prisma.books.update({
        where: {
          id: id,
        },
        data: {
          title,
          author,
          publishedDate,
          price,
        },
      });
      return res.status(StatusCodes.OK).json({
        message: "Book updated successfully",
        book: updatedBook,
      });
    } catch (err) {
      logger.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
  }
}
