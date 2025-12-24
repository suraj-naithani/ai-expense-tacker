export type PaymentType = "LENT" | "BORROWED";

export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE";

export interface CreatePaymentRequest {
    amount: number;
    personName: string;
    type: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface UpdatePaymentRequest {
    amount?: number;
    personName?: string;
    type?: PaymentType;
    description?: string;
    dueDate?: string;
    status?: PaymentStatus;
}

export interface PaymentFilters {
    page?: string;
    limit?: string;
    type?: PaymentType;
    status?: PaymentStatus;
}

