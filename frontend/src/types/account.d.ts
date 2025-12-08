export type FinancialAccountType =
    | "CURRENT"
    | "SAVINGS"
    | "CREDIT_CARD"
    | "CASH"
    | "INVESTMENT"
    | "OTHER";

export interface FinancialAccount {
    id: string;
    name: string;
    type: FinancialAccountType;
    balance: number;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GetAccountsResponse {
    success: boolean;
    message: string;
    data: FinancialAccount[];
}

export interface CreateAccountPayload {
    name: string;
    type: FinancialAccountType;
    balance: number;
    isDefault?: boolean;
}

export interface UpdateAccountPayload {
    name: string;
    type: FinancialAccountType;
    balance: number;
    isDefault?: boolean;
}

export interface CreateOrUpdateAccountResponse {
    success: boolean;
    message: string;
    data: FinancialAccount;
}

export interface DeleteAccountResponse {
    success: boolean;
    message: string;
}

export interface AccountState {
    accounts: FinancialAccount[];
    isLoading: boolean;
}

export interface DefaultAccountState {
    id: string | null;
}