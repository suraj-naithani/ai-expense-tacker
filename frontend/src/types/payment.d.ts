export type PaymentType = "LENT" | "BORROWED";

export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    personName: string;
    type: PaymentType;
    description: string | null;
    dueDate: string | null;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentFormValues {
    amount: number;
    personName: string;
    type: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface UpdatePaymentFormValues {
    amount?: number;
    personName?: string;
    type?: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface CreatePaymentPayload {
    amount: number;
    personName: string;
    type: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface UpdatePaymentPayload {
    amount?: number;
    personName?: string;
    type?: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data: Payment;
}

export interface GetPaymentsResponse {
    success: boolean;
    message: string;
    data: Payment[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UpdatePaymentResponse {
    success: boolean;
    message: string;
}

export interface UpdatePaymentStatusResponse {
    success: boolean;
    message: string;
}

export interface DeletePaymentResponse {
    success: boolean;
    message: string;
}

export interface BulkDeletePaymentResponse {
    success: boolean;
    message: string;
    data: {
        deletedCount: number;
    };
}

export interface GetPaymentsQueryParams {
    page?: number;
    limit?: number;
    type?: PaymentType;
    status?: PaymentStatus;
}

export interface GetPaymentsApiResponse extends GetPaymentsResponse {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

