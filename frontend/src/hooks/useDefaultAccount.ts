import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetAccountsQuery } from "@/redux/api/accountApi";
import { setDefaultAccountId } from "@/redux/slices/defaultAccountSlice";
import type { RootState } from "@/redux/store";

export const useDefaultAccount = () => {
    const { data } = useGetAccountsQuery();
    const defaultAccountId = useSelector(
        (state: RootState) => state.defaultAccount.id,
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (data?.data) {
            const defaultAccount = data.data.find((acc) => acc.isDefault);

            if (defaultAccount && defaultAccount.id !== defaultAccountId) {
                dispatch(setDefaultAccountId(defaultAccount.id));
            }

            if (!defaultAccount && defaultAccountId) {
                dispatch(setDefaultAccountId(null));
            }
        }
    }, [data, defaultAccountId, dispatch]);

    return defaultAccountId;
};

