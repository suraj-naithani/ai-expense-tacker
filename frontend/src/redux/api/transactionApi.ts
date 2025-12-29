import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    BulkDeleteTransactionResponse,
    CreateTransactionPayload,
    CreateTransactionResponse,
    DeleteTransactionResponse,
    GetTransactionsApiResponse,
    GetTransactionsQueryParams,
    ToggleRecurringResponse,
    UpdateTransactionPayload,
    UpdateTransactionResponse,
    CalendarTransactionsResponse,
    CalendarTransactionsQueryParams,
    DateTransactionsResponse,
    DateTransactionsQueryParams,
    UpcomingRecurringTransactionsResponse,
} from "@/types/transaction";
import { statsApi } from "./statsApi";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/transactions/`,
        credentials: "include",
    }),
    tagTypes: ["Transaction", "RecurringTransaction"],

    endpoints: (builder) => ({
        getTransactions: builder.query<GetTransactionsApiResponse, GetTransactionsQueryParams | void>({
            query: (params) => ({
                url: "get-transactions",
                params: params ?? {},
            }),
            providesTags: ["Transaction"],
        }),

        createTransaction: builder.mutation<CreateTransactionResponse, CreateTransactionPayload>({
            query: (body) => ({
                url: "create-transaction",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Transaction", "RecurringTransaction"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        toggleRecurringTransaction: builder.mutation<ToggleRecurringResponse, string>({
            query: (id) => ({
                url: `toggle-recurring/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["RecurringTransaction"],
        }),

        updateTransaction: builder.mutation<UpdateTransactionResponse, { id: string; body: UpdateTransactionPayload }>({
            query: ({ id, body }) => ({
                url: `update-transaction/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Transaction"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        deleteTransaction: builder.mutation<DeleteTransactionResponse, string>({
            query: (id) => ({
                url: `delete-transaction/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transaction", "RecurringTransaction"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        bulkDeleteTransactions: builder.mutation<BulkDeleteTransactionResponse, { ids: string[] }>({
            query: (body) => ({
                url: "bulk-delete-transactions",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Transaction", "RecurringTransaction"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        getCalendarTransactions: builder.query<CalendarTransactionsResponse, CalendarTransactionsQueryParams>({
            query: (params) => ({
                url: "calendar",
                params: {
                    ...(params.year && { year: params.year.toString() }),
                    ...(params.month && { month: params.month.toString() }),
                    ...(params.accountId && { accountId: params.accountId }),
                },
            }),
            providesTags: ["Transaction"],
        }),

        getDateTransactions: builder.query<DateTransactionsResponse, DateTransactionsQueryParams>({
            query: (params) => ({
                url: "date",
                params: {
                    date: params.date,
                    ...(params.accountId && { accountId: params.accountId }),
                },
            }),
            providesTags: (result, error, arg) => [
                { type: "Transaction", id: `DATE-${arg.date}` },
            ],
        }),

        getUpcomingRecurringTransactions: builder.query<UpcomingRecurringTransactionsResponse, void>({
            query: () => ({
                url: "upcoming-recurring",
            }),
            providesTags: ["RecurringTransaction"],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useToggleRecurringTransactionMutation,
    useDeleteTransactionMutation,
    useBulkDeleteTransactionsMutation,
    useGetCalendarTransactionsQuery,
    useGetDateTransactionsQuery,
    useGetUpcomingRecurringTransactionsQuery,
} = transactionApi;
