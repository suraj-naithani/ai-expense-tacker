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
    totalBalance: number;
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

