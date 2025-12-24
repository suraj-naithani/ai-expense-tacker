export type TransactionType = "EXPENSE" | "INCOME";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateTransactionRequest {
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}
export interface UpdateTransactionRequest {
    type?: TransactionType;
    categoryId?: string;
    amount?: number;
    description?: string;
    isActive?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface TransactionFilters {
    page?: string;
    limit?: string;
    type?: TransactionType;
    categoryId?: string;
    accountId?: string;
    isRecurring?: string;
}
