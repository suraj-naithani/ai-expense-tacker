import express from "express";
import { signIn, signUp } from "../controllers/authController";
import { validate } from "../middleware/validate";
import { signInSchema, signUpSchema } from "../validators/auth";

const app = express.Router();

app.post("/signup", validate(signUpSchema),  signUp);
app.post("/signin", validate(signInSchema), signIn);

export default app;