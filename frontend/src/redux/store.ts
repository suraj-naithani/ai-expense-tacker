import { configureStore } from "@reduxjs/toolkit";
import { accountApi } from "./api/accountApi";

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(accountApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;