import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    TransactionStatsResponse,
    TransactionStatsQueryParams,
    PaymentStatsResponse,
    PaymentStatsQueryParams,
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
    }),
});

export const {
    useGetTransactionStatsQuery,
    useGetPaymentStatsQuery,
} = statsApi;

