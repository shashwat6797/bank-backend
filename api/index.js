import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import userRoutes from "../routes/User.js";
import plaidRoutes from "../routes/Plaid.js";
import bankRoutes from "../routes/Bank.js";

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Express Server",
    status: "healthy",
  });
});

app.use("/user", userRoutes);

app.use("/plaid", plaidRoutes);

app.use("/bank", bankRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource could not be found",
  });
});

mongoose
  .connect(process.env.DATABASE_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true,
  })
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT || 3000, () => {
      console.log(`Server Running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
