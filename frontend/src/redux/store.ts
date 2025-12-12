import { configureStore } from "@reduxjs/toolkit";
import { accountApi } from "./api/accountApi";
import { categoryApi } from "./api/categoryApi";
import defaultAccountReducer from "./slices/defaultAccountSlice";

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        defaultAccount: defaultAccountReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(accountApi.middleware, categoryApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;