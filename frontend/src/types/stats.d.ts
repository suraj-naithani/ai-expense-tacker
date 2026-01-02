export type TimeRange = "monthly" | "3months" | "6months" | "yearly" | "custom";

export interface TransactionStatsQueryParams {
    timeRange?: TimeRange;
    startDate?: string;
    endDate?: string;
    accountId: string;
}

export interface ComparisonData {
    change: number;
    type: "increase" | "decrease" | "no-change";
}

export interface PeriodData {
    start: string;
    end: string;
}

export interface TransactionStatsData {
    totalBalance: number; // Complete all-time balance
    periodSavings: number; // Savings for the selected period (income - expenses)
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    incomeCount: number;
    expenseCount: number;
    periods: {
        current: PeriodData;
        previous?: PeriodData;
    };
    comparisons?: {
        totalBalance: ComparisonData;
        totalTransactions: ComparisonData;
        totalIncome: ComparisonData;
        totalExpenses: ComparisonData;
    };
    timeRange: TimeRange;
}

export interface TransactionStatsResponse {
    success: boolean;
    message: string;
    data: TransactionStatsData;
}

export interface PaymentStatsQueryParams {
    accountId: string;
}

export interface PaymentStatsData {
    unpaidLent: number;
    unpaidBorrowed: number;
    activePaymentsCount: number;
    netBalance: number;
}

export interface PaymentStatsResponse {
    success: boolean;
    message: string;
    data: PaymentStatsData;
}

export interface TransactionGraphQueryParams {
    accountId?: string;
}

export interface MonthlyGraphData {
    month: string; // Format: "MMM YYYY"
    income: number;
    expense: number;
    savings: number;
}

export interface TransactionGraphResponse {
    success: boolean;
    message: string;
    data: MonthlyGraphData[];
}

export interface IncomeExpenseSavingsQueryParams {
    timeRange?: TimeRange;
    startDate?: string;
    endDate?: string;
    accountId: string;
}

export interface IncomeExpenseSavingsData {
    income: {
        total: number;
        percentage: number;
    };
    expenses: {
        total: number;
        percentage: number;
    };
    savings: {
        total: number;
        percentage: number;
    };
}

export interface IncomeExpenseSavingsResponse {
    success: boolean;
    message: string;
    data: IncomeExpenseSavingsData;
}

export interface DailySpendingQueryParams {
    accountId: string;
}

export interface DailySpendingData {
    day: string; // Day name: "Sun", "Mon", etc.
    amount: number; // Total expense for that day
    date: string; // Date in YYYY-MM-DD format
}

export interface DailySpendingResponse {
    success: boolean;
    message: string;
    data: DailySpendingData[];
}

export interface CategorySpendingQueryParams {
    accountId: string;
}

export interface CategorySpendingData {
    month: string; // "Jan", "Feb", etc.
    [categoryName: string]: number; // Dynamic category names as keys with amounts as values
}

export interface CategorySpendingResponse {
    success: boolean;
    message: string;
    data: CategorySpendingData[];
}

