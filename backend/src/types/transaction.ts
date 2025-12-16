export type TransactionType = "EXPENSE" | "INCOME";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateTransactionRequest {
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    /**
     * ISO string; if omitted, server uses current UTC time.
     */
    date?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface TransactionFilters {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
    categoryId?: string;
    accountId?: string;
}
