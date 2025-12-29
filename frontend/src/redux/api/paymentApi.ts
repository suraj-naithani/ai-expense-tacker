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
import { statsApi } from "./statsApi";

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
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        updatePayment: builder.mutation<UpdatePaymentResponse, { id: string; body: UpdatePaymentPayload }>({
            query: ({ id, body }) => ({
                url: `update-payment/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Payment"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        updatePaymentStatus: builder.mutation<UpdatePaymentStatusResponse, { id: string; status: "PENDING" | "PAID" | "OVERDUE" }>({
            query: ({ id, status }) => ({
                url: `update-payment-status/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Payment"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        deletePayment: builder.mutation<DeletePaymentResponse, string>({
            query: (id) => ({
                url: `delete-payment/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payment"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
        }),

        bulkDeletePayments: builder.mutation<BulkDeletePaymentResponse, { ids: string[] }>({
            query: (body) => ({
                url: "bulk-delete-payments",
                method: "DELETE",
                body,
            }),
            invalidatesTags: ["Payment"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(statsApi.util.invalidateTags(["Stats"]));
                } catch {
                    // Stats will be invalidated on success
                }
            },
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

