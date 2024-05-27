import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import morgan from "morgan";
import cors from "cors";
import globalRouter from "./routes";
import multer from "multer";

dotenv.config();
const PORT = 6001;

// init app
const app = express();

//init middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(multer({ dest: "uploads/" }).any());

app.use("/api", globalRouter);

app.listen(PORT, () => {
  console.log(`app running on ${PORT}`);
});
