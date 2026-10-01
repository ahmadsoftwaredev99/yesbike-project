import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

// Parse allowed CORS origins from environment or sensible defaults
const parseAllowedOrigins = () => {
  const envOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) => o.trim()).filter(Boolean)
    : [];
  const vercelEnvOrigins = [];
  if (process.env.VERCEL_URL) {
    vercelEnvOrigins.push(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    vercelEnvOrigins.push(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  return [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    ...vercelEnvOrigins,
    ...envOrigins,
  ];
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, same-origin, server-to-server)
      if (!origin) return callback(null, true);

      const allowed = parseAllowedOrigins();
      const isAllowedExplicit = allowed.includes(origin);
      // Allow Vercel preview and production subdomains (*.vercel.app)
      const isVercelSubdomain =
        origin.endsWith(".vercel.app") ||
        /^https:\/\/[a-z0-9-]+-.*\.vercel\.app$/.test(origin);

      if (isAllowedExplicit || isVercelSubdomain) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true, limit: "4mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check endpoint (available with or without /api prefix)
const healthHandler = (req, res) =>
  res.json({
    success: true,
    message: "YES BIKE API is running",
    timestamp: new Date().toISOString(),
  });

app.get(["/api", "/api/", "/api/health", "/health"], healthHandler);

// Database connection middleware: ensures MongoDB is connected for incoming API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Mount routes with and without /api prefix for robust serverless rewrite compatibility
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/users", userRoutes);
app.use("/users", userRoutes);

app.use("/api/contacts", contactRoutes);
app.use("/contacts", contactRoutes);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
