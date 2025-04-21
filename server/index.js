import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import throng from "throng";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import allowedOrigins from "./allowedOrigins.js";

import userRouter from "./route/user.js";
import productRouter from "./route/product.js";
import fdcRouter from "./route/fdc.js";
import redis from "./utils/redis.js";
import listingRouter from "./route/listing.js";

// Load environment variables
dotenv.config({ path: "./.env" });
const workers = process.env.WEB_CONCURRENCY || 5;

async function startWorker(id) {
  const PORT = process.env.PORT || 5000;
  const app = express();

  if (process.env.ENV === "development") {
    allowedOrigins.push(`http://localhost:3000`);
  }

  // Middleware
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );
  app.use(express.json());

  // Security middleware
  app.use(helmet());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  app.get("/", (req, res) => {
    res.send("Bohemauth Server is running");
  });

  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/fdc", fdcRouter);
  app.use("/api/listing", listingRouter);

  app.get("/health", (req, res) => {
    return res.json({
      success: true,
      message: "Bohemauth Server is running",
      workerId: id,
    });
  });

  // Listen for requests
  app.listen(PORT, () => {
    console.log(`Bohemauth Server worker ${id} is initialized on port ${PORT}`);
  });

  // Redis connection
  redis.on("connect", async () => {
    console.log("Successfully connected to Redis");
  });

  redis.on("error", (err) => {
    console.error("Redis connection error:", err);
  });

  process.on("SIGTERM", async () => {
    console.log(`Worker ${id} exiting...`);
    // Perform cleanup
    try {
      // Cancel any pending jobs gracefully
    } catch (error) {
      console.error(`Error during worker ${id} cleanup:`, error);
    }
    process.exit();
  });
}

throng({
  workers,
  start: startWorker,
});
