import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import linkRoutes from "./routes/link.route";
import { prisma } from "./lib/prisma";
import cors from "cors";
import logger from "./lib/logger";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

app.listen(PORT, async () => {
  logger.info(`Server started on port ${PORT}`);
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (error) {
    logger.error("Error connecting to database:", error);
  }
});
