import express from "express";
import { createAccount, deleteAccount, deleteAccounts, getAccounts, updateAccount } from "../controllers/account.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { deleteAccountsSchema, createAccountSchema, deleteAccountParamSchema, updateAccountSchema } from "../validators/account.validator.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-account", validate(createAccountSchema), createAccount);

app.get("/get-account", getAccounts);

app.patch("/update-account/:id", validate(updateAccountSchema), updateAccount);

app.delete("/delete-account/:id", validate(deleteAccountParamSchema), deleteAccount);

app.delete("/delete-accounts", validate(deleteAccountsSchema), deleteAccounts);

export default app;
