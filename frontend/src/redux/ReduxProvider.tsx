"use client";

import { Provider } from "react-redux";
import type { ReactNode } from "react";

import store from "./store";

interface ReduxProviderProps {
    children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}


