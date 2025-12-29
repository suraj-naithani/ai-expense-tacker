import { configureStore } from "@reduxjs/toolkit";
import { accountApi } from "./api/accountApi";
import { categoryApi } from "./api/categoryApi";
import { transactionApi } from "./api/transactionApi";
import { paymentApi } from "./api/paymentApi";
import { statsApi } from "./api/statsApi";
import defaultAccountReducer from "./slices/defaultAccountSlice";

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [transactionApi.reducerPath]: transactionApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [statsApi.reducerPath]: statsApi.reducer,
        defaultAccount: defaultAccountReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountApi.middleware,
            categoryApi.middleware,
            transactionApi.middleware,
            paymentApi.middleware,
            statsApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;