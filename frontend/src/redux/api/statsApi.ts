import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    TransactionStatsResponse,
    TransactionStatsQueryParams,
    PaymentStatsResponse,
    PaymentStatsQueryParams,
    TransactionGraphResponse,
    TransactionGraphQueryParams,
    IncomeExpenseSavingsResponse,
    IncomeExpenseSavingsQueryParams,
    DailySpendingResponse,
    DailySpendingQueryParams,
    CategorySpendingResponse,
    CategorySpendingQueryParams,
    DashboardStatsResponse,
    MonthlySpendingResponse,
    CategorySpendingDistributionResponse,
    CategorySpendingDistributionQueryParams,
} from "@/types/stats";

export const statsApi = createApi({
    reducerPath: "statsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/stats/`,
        credentials: "include",
    }),
    tagTypes: ["Stats"],

    endpoints: (builder) => ({
        getTransactionStats: builder.query<TransactionStatsResponse, TransactionStatsQueryParams>({
            query: (params) => ({
                url: "transaction",
                params: {
                    ...(params.timeRange && { timeRange: params.timeRange }),
                    ...(params.startDate && { startDate: params.startDate }),
                    ...(params.endDate && { endDate: params.endDate }),
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
        getPaymentStats: builder.query<PaymentStatsResponse, PaymentStatsQueryParams>({
            query: (params) => ({
                url: "payment",
                params: {
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
        getTransactionGraph: builder.query<TransactionGraphResponse, TransactionGraphQueryParams>({
            query: (params) => ({
                url: "transaction/graph",
                params: {
                    ...(params.accountId && { accountId: params.accountId }),
                },
            }),
            providesTags: ["Stats"],
        }),
        getIncomeExpenseSavings: builder.query<IncomeExpenseSavingsResponse, IncomeExpenseSavingsQueryParams>({
            query: (params) => ({
                url: "income-expense-savings",
                params: {
                    ...(params.timeRange && { timeRange: params.timeRange }),
                    ...(params.startDate && { startDate: params.startDate }),
                    ...(params.endDate && { endDate: params.endDate }),
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
        getDailySpending: builder.query<DailySpendingResponse, DailySpendingQueryParams>({
            query: (params) => ({
                url: "daily-spending",
                params: {
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
        getCategorySpending: builder.query<CategorySpendingResponse, CategorySpendingQueryParams>({
            query: (params) => ({
                url: "category-spending",
                params: {
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
        getDashboardStats: builder.query<DashboardStatsResponse, void>({
            query: () => ({
                url: "dashboard",
            }),
            providesTags: ["Stats"],
        }),
        getAllAccountsDailySpending: builder.query<DailySpendingResponse, void>({
            query: () => ({
                url: "dashboard/daily-spending",
            }),
            providesTags: ["Stats"],
        }),
        getAllAccountsCategorySpending: builder.query<CategorySpendingResponse, void>({
            query: () => ({
                url: "dashboard/category-spending",
            }),
            providesTags: ["Stats"],
        }),
        getAllAccountsYearlyMonthlySpending: builder.query<MonthlySpendingResponse, void>({
            query: () => ({
                url: "dashboard/yearly-monthly-spending",
            }),
            providesTags: ["Stats"],
        }),
        getCategorySpendingDistribution: builder.query<CategorySpendingDistributionResponse, CategorySpendingDistributionQueryParams>({
            query: (params) => ({
                url: "category-spending-distribution",
                params: {
                    accountId: params.accountId,
                },
            }),
            providesTags: ["Stats"],
        }),
    }),
});

export const {
    useGetTransactionStatsQuery,
    useGetPaymentStatsQuery,
    useGetTransactionGraphQuery,
    useGetIncomeExpenseSavingsQuery,
    useGetDailySpendingQuery,
    useGetCategorySpendingQuery,
    useGetDashboardStatsQuery,
    useGetAllAccountsDailySpendingQuery,
    useGetAllAccountsCategorySpendingQuery,
    useGetAllAccountsYearlyMonthlySpendingQuery,
    useGetCategorySpendingDistributionQuery,
} = statsApi;

