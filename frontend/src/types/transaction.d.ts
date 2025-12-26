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
    recurringInterval?: RecurringInterval;
    isActive?: boolean;
}

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

export interface BulkDeleteTransactionResponse {
    success: boolean;
    message: string;
    data: {
        deletedCount: number;
    };
}

export interface GetTransactionsQueryParams {
    page?: number;
    limit?: number;
    type?: TransactionType;
    categoryId?: string;
    accountId?: string;
    isRecurring?: string;
}

export interface GetTransactionsApiResponse extends GetTransactionsResponse {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CalendarDailyData {
    date: string;
    count: number;
    sum: number;
    latestTransactions: Array<{
        description: string | null;
        amount: number;
        type: TransactionType;
    }>;
}

export interface CalendarMonthlySummary {
    totalIncome: {
        amount: number;
        count: number;
    };
    totalExpenses: {
        amount: number;
        count: number;
    };
    netIncome: number;
    daysWithTransactions: number;
    averageDailySpending: number;
}

export interface CalendarTransactionsResponse {
    success: boolean;
    message: string;
    data: {
        dailyData: CalendarDailyData[];
        monthlySummary: CalendarMonthlySummary;
    };
}

export interface CalendarTransactionsQueryParams {
    year?: number;
    month?: number;
    accountId?: string;
}

export interface DateTransactionsSummary {
    totalIncome: number;
    totalExpense: number;
    count: number;
    netIncome: number;
}

export interface DateTransactionsResponse {
    success: boolean;
    message: string;
    data: {
        transactions: Transaction[];
        summary: DateTransactionsSummary;
    };
}

export interface DateTransactionsQueryParams {
    date: string;
    accountId?: string;
}

export interface UpcomingRecurringTransaction {
    id: string;
    amount: number;
    type: TransactionType;
    description: string | null;
    nextExecutionDate: string;
    recurringInterval: RecurringInterval | null;
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

export interface UpcomingRecurringTransactionsResponse {
    success: boolean;
    message: string;
    data: UpcomingRecurringTransaction[];
}
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

export interface FormState {
    type: TransactionType;
    amount: string;
    categoryId: string;
    description: string;
    isRecurring: boolean;
    recurringInterval: string;
}

export interface UpdateFormState {
    type: TransactionType;
    amount: string;
    categoryId: string;
    description: string;
    recurringInterval: string;
    isActive: boolean;
}

export interface AddTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (values: {
        type: TransactionType;
        amount: number;
        categoryId: string;
        description?: string;
        isRecurring?: boolean;
        recurringInterval?: RecurringInterval;
    }) => void;
}

export interface UpdateTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onSave: (values: {
        type: TransactionType;
        amount: number;
        categoryId: string;
        description?: string;
        isActive?: boolean;
        recurringInterval?: RecurringInterval;
    }) => void;
}

export interface DeleteTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transactionDescription?: string;
    transactionAmount?: number;
    transactionType?: TransactionType;
    onConfirm: () => void;
    bulkDeleteCount?: number;
}

export interface TransactionsTableProps {
    transactions: Transaction[];
    isLoading?: boolean;
    variant?: "regular" | "recurring";
    selectedTransactions?: string[];
    onSelectTransaction?: (id: string) => void;
    onSelectAll?: () => void;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
    onToggleActive?: (transaction: Transaction) => void;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: string) => void;
    emptyMessage?: string;
}
