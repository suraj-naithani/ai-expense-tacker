import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    BulkDeletePaymentResponse,
    CreatePaymentPayload,
    CreatePaymentResponse,
    DeletePaymentResponse,
    GetPaymentsApiResponse,
    GetPaymentsQueryParams,
    UpdatePaymentPayload,
    UpdatePaymentResponse,
    UpdatePaymentStatusResponse,
} from "@/types/payment";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/payments/`,
        credentials: "include",
    }),
    tagTypes: ["Payment"],

    endpoints: (builder) => ({
        getPayments: builder.query<GetPaymentsApiResponse, GetPaymentsQueryParams | void>({
            query: (params) => ({
                url: "get-payments",
                params: params ?? {},
            }),
            providesTags: ["Payment"],
        }),

        createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentPayload>({
            query: (body) => ({
                url: "create-payment",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payment"],
        }),

        updatePayment: builder.mutation<UpdatePaymentResponse, { id: string; body: UpdatePaymentPayload }>({
            query: ({ id, body }) => ({
                url: `update-payment/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Payment"],
        }),

        updatePaymentStatus: builder.mutation<UpdatePaymentStatusResponse, { id: string; status: "PENDING" | "PAID" | "OVERDUE" }>({
            query: ({ id, status }) => ({
                url: `update-payment-status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Payment"],
        }),

        deletePayment: builder.mutation<DeletePaymentResponse, string>({
            query: (id) => ({
                url: `delete-payment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payment"],
        }),

        bulkDeletePayments: builder.mutation<BulkDeletePaymentResponse, { ids: string[] }>({
            query: (body) => ({
                url: "bulk-delete-payments",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Payment"],
        }),
    }),
});

export const {
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useUpdatePaymentMutation,
    useUpdatePaymentStatusMutation,
    useDeletePaymentMutation,
    useBulkDeletePaymentsMutation,
} = paymentApi;

