import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AccountState, FinancialAccount } from "@/types/account";

const initialState: AccountState = {
    accounts: [],
    isLoading: false,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccounts: (state, action: PayloadAction<FinancialAccount[]>) => {
            state.accounts = action.payload;
        },
        addAccount: (state, action: PayloadAction<FinancialAccount>) => {
            state.accounts.push(action.payload);
        },
        updateAccount: (state, action: PayloadAction<FinancialAccount>) => {
            const index = state.accounts.findIndex(
                (account) => account.id === action.payload.id
            );
            if (index !== -1) {
                state.accounts[index] = action.payload;
            }
        },
        removeAccount: (state, action: PayloadAction<string>) => {
            state.accounts = state.accounts.filter(
                (account) => account.id !== action.payload
            );
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    setAccounts,
    addAccount,
    updateAccount,
    removeAccount,
    setLoading,
} = accountSlice.actions;
export const accountReducer = accountSlice;