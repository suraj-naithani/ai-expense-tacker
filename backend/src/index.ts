// Load environment variables first (before any other imports)
import "./utils/env";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./routes/authRoute";
import { connectDB } from "./utils/connection";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants/config";
import rateLimit from "express-rate-limit";
import env from "./utils/env";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
// Use different log levels based on environment
app.use(morgan(env.isProduction() ? "combined" : "dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.get("/", (req, res) => {
    res.send("🚀 Server is running successfully!");
});

app.use("/api/v1/auth", authRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📦 Environment: ${env.NODE_ENV.toUpperCase()}`);
    });
})