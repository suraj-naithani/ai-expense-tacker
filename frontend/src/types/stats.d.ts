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

export interface DashboardStatsData {
    totalBalance: {
        amount: number;
        change: number;
        type: "increase" | "decrease" | "no-change";
    };
    monthlyIncome: {
        amount: number;
        change: number;
        type: "increase" | "decrease" | "no-change";
    };
    monthlyExpense: {
        amount: number;
        change: number;
        type: "increase" | "decrease" | "no-change";
    };
    savingsRate: {
        percentage: number;
        change: number;
        type: "increase" | "decrease" | "no-change";
    };
}

export interface DashboardStatsResponse {
    success: boolean;
    message: string;
    data: DashboardStatsData;
}

export interface MonthlySpendingData {
    month: string; // Format: "Jan", "Feb", etc.
    amount: number;
}

export interface MonthlySpendingResponse {
    success: boolean;
    message: string;
    data: MonthlySpendingData[];
}

export interface CategorySpendingDistributionData {
    category: string;
    amount: number;
}

export interface CategorySpendingDistributionQueryParams {
    accountId: string;
}

export interface CategorySpendingDistributionResponse {
    success: boolean;
    message: string;
    data: CategorySpendingDistributionData[];
}

