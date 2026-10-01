import mongoose from "mongoose";
import dns from "dns";

// Custom DNS fallback for local development where ISP DNS may fail on MongoDB SRV records.
// In cloud/serverless environments (e.g. Vercel), preserve platform DNS unless explicitly requested.
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (err) {
    // Non-fatal if system does not permit overriding DNS servers
  }
}

// Global cached connection across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not defined");
  }

  // If connection is already open and ready, reuse it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast on dropped connection rather than hanging
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
