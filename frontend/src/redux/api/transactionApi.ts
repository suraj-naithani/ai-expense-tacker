import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    CreateTransactionPayload,
    CreateTransactionResponse,
    DeleteTransactionResponse,
    GetTransactionsApiResponse,
    GetTransactionsQueryParams,
    ToggleRecurringResponse,
    UpdateTransactionPayload,
    UpdateTransactionResponse,
} from "@/types/transaction";

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
        }),

        deleteTransaction: builder.mutation<DeleteTransactionResponse, string>({
            query: (id) => ({
                url: `delete-transaction/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Transaction", "RecurringTransaction"],
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useCreateTransactionMutation,
    useUpdateTransactionMutation,
    useToggleRecurringTransactionMutation,
    useDeleteTransactionMutation,
} = transactionApi;
