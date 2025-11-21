import "./config/env.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { corsOptions } from "./constants/config.js";
import { auth } from "./utils/auth.js";
import rateLimit from "express-rate-limit";
import { connectDB } from "./utils/connection.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.get("/", (req, res) => {
    res.send("🚀 Server is running successfully!");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
})