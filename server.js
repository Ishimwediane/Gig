import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import mainRouter from './routes/indexRouting.js';

dotenv.config();

const app = express();

// Use Express's built-in parsers instead of bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_name = process.env.DB_NAME;
const db_port = process.env.PORT || 3000;

// Build MongoDB connection string
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.0hhji.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(dbUri)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(db_port, () => {
      console.log(`🚀 Server running at: http://localhost:${db_port}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Main route handler
app.use("/", mainRouter);