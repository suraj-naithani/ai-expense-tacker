export type TransactionType = "EXPENSE" | "INCOME";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateTransactionFormValues {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface UpdateTransactionFormValues {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
    isActive?: boolean;
}

// Keep for backward compatibility
export interface TransactionFormValues {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface TransactionFormState {
    type: TransactionType;
    amount: string;
    category: string;
    description: string;
    isRecurring: boolean;
    recurringInterval: string;
}

export interface CreateTransactionPayload {
    accountId: string;
    categoryId?: string;
    amount: number;
    type: TransactionType;
    description?: string;
    isRecurring?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    type: TransactionType;
    description: string | null;
    isRecurring: boolean;
    recurringInterval: RecurringInterval | null;
    nextExecutionDate: string | null;
    isActive: boolean;
    parentRecurringId: string | null;
    createdAt: string;
    updatedAt: string;
    account: {
        id: string;
        name: string;
        type: string;
    };
    category: {
        id: string;
        name: string;
        icon: string;
    } | null;
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
    categoryId?: string;
    amount?: number;
    description?: string;
    isActive?: boolean;
    recurringInterval?: RecurringInterval;
}

export interface UpdateTransactionResponse {
    success: boolean;
    message: string;
    data: Transaction;
}

export interface DeleteTransactionResponse {
    success: boolean;
    message: string;
}

// Query parameters for getTransactions
export interface GetTransactionsQueryParams {
    page?: number;
    limit?: number;
    type?: TransactionType;
    categoryId?: string;
    accountId?: string;
    isRecurring?: string;
}

// Extended response with pagination
export interface GetTransactionsApiResponse extends GetTransactionsResponse {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Recurring transaction template (the rule/schedule)
export interface RecurringTransactionTemplate {
    id: string;
    userId: string;
    accountId: string;
    categoryId: string | null;
    amount: number;
    type: TransactionType;
    description: string | null;
    isRecurring: boolean;
    recurringInterval: RecurringInterval | null;
    nextExecutionDate: string | null;
    isActive: boolean;
    parentRecurringId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateRecurringPayload {
    isActive?: boolean;
    recurringInterval?: RecurringInterval;
    nextExecutionDate?: string;
}

export interface ToggleRecurringResponse {
    success: boolean;
    message: string;
    data: RecurringTransactionTemplate;
}

export interface UpdateRecurringResponse {
    success: boolean;
    message: string;
    data: RecurringTransactionTemplate;
}
