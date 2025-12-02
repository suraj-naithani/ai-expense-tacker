import express from "express";
import { createAccount, getAccounts, updateAccount } from "../controllers/account.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAccountSchema, updateAccountSchema } from "../validators/account.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-account", validate(createAccountSchema), createAccount);

app.get("/get-account", getAccounts);

app.patch("/update-account/:id", validate(updateAccountSchema), updateAccount);

export default app;
