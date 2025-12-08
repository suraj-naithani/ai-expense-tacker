export type TransactionType = "expense" | "income";

export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly";

export interface TransactionFormState {
    type: TransactionType;
    amount: string;
    category: string;
    description: string;
    isRecurring: boolean;
    recurringInterval: string;
}

export interface CreateTransactionPayload {
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    accountId: string;
    isRecurring: boolean;
    recurringInterval?: RecurringInterval;
}

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    accountId: string;
    isRecurring: boolean;
    recurringInterval?: RecurringInterval;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

export interface GetTransactionsResponse {
    success: boolean;
    message: string;
    data: Transaction[];
}

export interface UpdateTransactionPayload {
    type?: TransactionType;
    amount?: number;
    category?: string;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface DeleteTransactionResponse {
    success: boolean;
    message: string;
}

