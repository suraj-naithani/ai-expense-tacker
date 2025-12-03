import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    CreateAccountPayload,
    CreateOrUpdateAccountResponse,
    DeleteAccountResponse,
    GetAccountsResponse,
    UpdateAccountPayload,
} from "@/types/account";

export const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/accounts/`,
        credentials: "include",
    }),
    tagTypes: ["Account"],

    endpoints: (builder) => ({
        getAccounts: builder.query<GetAccountsResponse, void>({
            query: () => "get-account",
            providesTags: ["Account"],
        }),

        createAccount: builder.mutation<CreateOrUpdateAccountResponse, CreateAccountPayload>({
            query: (body) => ({
                url: "create-account",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Account"],
        }),

        updateAccount: builder.mutation<CreateOrUpdateAccountResponse, { id: string; body: UpdateAccountPayload }>({
            query: ({ id, body }) => ({
                url: `update-account/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Account"],
        }),

        deleteAccount: builder.mutation<DeleteAccountResponse, string>({
            query: (id) => ({
                url: `delete-account/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Account"],
        }),
    }),
});

export const {
    useGetAccountsQuery,
    useCreateAccountMutation,
    useUpdateAccountMutation,
    useDeleteAccountMutation,
} = accountApi;