import { Router } from "express";
import sellerMiddleware from "../../middlewares/seller.middleware";
import SellerController from "./seller.controller";
import multer from "multer";

const sellerRouter = Router();

const storage = multer({
  dest: "uploads/", // This will store files in the 'uploads' directory
});

sellerRouter.post("/add-book", sellerMiddleware, SellerController.addBookEntry);
sellerRouter.post(
  "/add-books",
  sellerMiddleware,
  SellerController.addMultipleBooksEntry
);
sellerRouter.delete(
  "/delete-book/:id",
  sellerMiddleware,
  SellerController.deleteBookEntry
);
sellerRouter.put(
  "/update-book/:id",
  sellerMiddleware,
  SellerController.updateBookEntry
);

sellerRouter.get("/my-books", sellerMiddleware, SellerController.getMyBooks);
sellerRouter.get(
  "/my-book/:id",
  sellerMiddleware,
  SellerController.getBookById
);

export default sellerRouter;
