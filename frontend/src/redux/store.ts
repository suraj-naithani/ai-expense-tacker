import { configureStore } from "@reduxjs/toolkit";
import { accountApi } from "./api/accountApi";
import { accountReducer } from "./reducers/accountReducer";

export const store = configureStore({
    reducer: {
        [accountApi.reducerPath]: accountApi.reducer,
        [accountReducer.name]: accountReducer.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(accountApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;