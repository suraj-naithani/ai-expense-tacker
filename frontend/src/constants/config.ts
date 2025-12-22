import type { TransactionType, RecurringInterval, FormState, UpdateFormState } from "@/types/transaction";

export const server = process.env.NEXT_PUBLIC_SERVER_URL;

// Transaction constants
export const TRANSACTION_TYPES: Array<{ value: TransactionType; label: string }> = [
    { value: "EXPENSE", label: "Expense" },
    { value: "INCOME", label: "Income" },
] as const;

export const RECURRING_INTERVALS: Array<{ value: RecurringInterval; label: string }> = [
    { value: "DAILY", label: "Daily" },
    { value: "WEEKLY", label: "Weekly" },
    { value: "MONTHLY", label: "Monthly" },
    { value: "YEARLY", label: "Yearly" },
] as const;

export const initialState: FormState = {
    type: "EXPENSE",
    amount: "",
    categoryId: "",
    description: "",
    isRecurring: false,
    recurringInterval: "",
};

export const updateInitialState: UpdateFormState = {
    type: "EXPENSE",
    amount: "",
    categoryId: "",
    description: "",
    recurringInterval: "",
    isActive: true,
};
