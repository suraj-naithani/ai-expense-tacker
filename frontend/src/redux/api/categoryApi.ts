import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/constants/config";
import {
    CreateCategoryPayload,
    CreateOrUpdateCategoryResponse,
    DeleteCategoryResponse,
    GetCategoriesResponse,
    UpdateCategoryPayload,
} from "@/types/category";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/categories/`,
        credentials: "include",
    }),
    tagTypes: ["Category"],

    endpoints: (builder) => ({
        getCategories: builder.query<GetCategoriesResponse, void>({
            query: () => "get-category",
            providesTags: ["Category"],
        }),

        createCategory: builder.mutation<CreateOrUpdateCategoryResponse, CreateCategoryPayload>({
            query: (body) => ({
                url: "create-category",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        updateCategory: builder.mutation<CreateOrUpdateCategoryResponse, { id: string; body: UpdateCategoryPayload }>({
            query: ({ id, body }) => ({
                url: `update-category/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
            query: (id) => ({
                url: `delete-category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;

