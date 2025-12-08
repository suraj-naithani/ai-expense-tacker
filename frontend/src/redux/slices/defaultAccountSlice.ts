import { DefaultAccountState } from "@/types/account";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: DefaultAccountState = {
    id: null,
};

const defaultAccountSlice = createSlice({
    name: "defaultAccount",
    initialState,
    reducers: {
        setDefaultAccountId: (state, action: PayloadAction<string | null>) => {
            state.id = action.payload;
        },
        clearDefaultAccountId: (state) => {
            state.id = null;
        },
    },
});

export const { setDefaultAccountId, clearDefaultAccountId } =
    defaultAccountSlice.actions;

export default defaultAccountSlice.reducer;

