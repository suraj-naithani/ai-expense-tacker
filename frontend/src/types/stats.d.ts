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

