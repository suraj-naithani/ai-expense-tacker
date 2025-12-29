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

