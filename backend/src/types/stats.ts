export type TimeRange = "monthly" | "3months" | "6months" | "yearly" | "custom";

export interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface PreviousDateRange {
    startDate: Date;
    endDate: Date;
}

export interface TransactionStatsQueryParams {
    timeRange?: TimeRange;
    startDate?: string;
    endDate?: string;
    accountId?: string;
}

export interface ComparisonData {
    change: number;
    type: "increase" | "decrease" | "no-change";
}

export interface PeriodData {
    start: string;
    end: string;
}

export interface TransactionStats {
    totalBalance: number;
    totalTransactions: number;
    totalIncome: number;
    totalExpenses: number;
    incomeCount: number;
    expenseCount: number;
}

export interface TransactionStatsWithComparison {
    current: TransactionStats;
    previous: TransactionStats;
    comparisons: {
        totalBalance: ComparisonData;
        totalTransactions: ComparisonData;
        totalIncome: ComparisonData;
        totalExpenses: ComparisonData;
    };
    periods: {
        current: PeriodData;
        previous: PeriodData;
    };
}

export interface PaymentStatsQueryParams {
    accountId?: string;
}

export interface PaymentStats {
    unpaidLent: number;
    unpaidBorrowed: number;
    activePaymentsCount: number;
    netBalance: number;
}

export interface TransactionGraphQueryParams {
    accountId?: string;
}

export interface MonthlyGraphData {
    month: string;
    income: number;
    expense: number;
    savings: number;
}

export interface TransactionGraphData {
    data: MonthlyGraphData[];
}

export interface DailySpendingQueryParams {
    accountId?: string;
}

export interface DailySpendingData {
    day: string;
    amount: number;
    date: string;
}

export interface DailySpendingResponse {
    data: DailySpendingData[];
}

export interface IncomeExpenseSavingsQueryParams {
    timeRange?: TimeRange;
    startDate?: string;
    endDate?: string;
    accountId?: string;
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

export interface CategorySpendingQueryParams {
    accountId?: string;
}

export interface CategorySpendingData {
    month: string;
    [categoryName: string]: string | number;
}

export interface MonthlySpendingData {
    month: string;
    amount: number;
}

export interface CategorySpendingDistributionData {
    category: string;
    amount: number;
}
