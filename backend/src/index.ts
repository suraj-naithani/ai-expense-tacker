import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoute from "./routes/authRoute";
import { connectDB } from "./utils/connection";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constants/config";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
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

app.use("/api/v1/auth", authRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
})