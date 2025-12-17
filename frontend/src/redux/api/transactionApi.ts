import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    CreateTransactionPayload,
    CreateTransactionResponse,
    DeleteTransactionResponse,
    GetTransactionsApiResponse,
    GetTransactionsQueryParams,
    ToggleRecurringResponse,
    UpdateRecurringPayload,
    UpdateRecurringResponse,
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

        updateRecurringTransaction: builder.mutation<UpdateRecurringResponse, { id: string; body: UpdateRecurringPayload }>(
            {
                query: ({ id, body }) => ({
                    url: `update-recurring/${id}`,
                    method: "PATCH",
                    body,
                }),
                invalidatesTags: ["RecurringTransaction"],
            },
        ),

        toggleRecurringTransaction: builder.mutation<ToggleRecurringResponse, string>({
            query: (id) => ({
                url: `toggle-recurring/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["RecurringTransaction"],
        }),

        // Delete a transaction (template or occurrence)
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
    useUpdateRecurringTransactionMutation,
    useToggleRecurringTransactionMutation,
    useDeleteTransactionMutation,
} = transactionApi;
