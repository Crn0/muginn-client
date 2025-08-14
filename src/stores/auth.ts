import type { AuthError } from "@/errors";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  token: null,
  error: null,
  isRefreshingToken: false,
  isPending: false,
  isSuccess: false,
  isError: false,
};

export interface IAuthStore {
  token: string | null;
  error: AuthError | null;
  isRefreshingToken: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;

  setToken: (state: string | null) => void;
  setError: (state: AuthError) => void;
  setIsRefreshingToken: (state: boolean) => void;
  setIsPending: (state: boolean) => void;
  setIsSuccess: (state: boolean) => void;
  setIsError: (state: boolean) => void;

  reset: () => void;
}

export const useAuthStore = create(
  devtools<IAuthStore>((set) => ({
    ...initialState,
    setToken: (token) => set(() => ({ token })),
    setError: (error) => set(() => ({ error })),
    setIsRefreshingToken: (isRefreshingToken) => set(() => ({ isRefreshingToken })),
    setIsPending: (isPending) => set(() => ({ isPending })),
    setIsSuccess: (isSuccess) => set(() => ({ isSuccess })),
    setIsError: (isError) => set(() => ({ isError })),

    reset: () => {
      set(initialState);
    },
  }))
);

export const getToken = () => useAuthStore.getState().token;
export const getIsRefreshingToken = () => useAuthStore.getState().isRefreshingToken;

export const setToken = (token: string | null) => useAuthStore.setState({ token });
export const setError = (error: AuthError) => useAuthStore.setState({ error });
export const setIsRefreshingToken = (isRefreshingToken: boolean) =>
  useAuthStore.setState({ isRefreshingToken });
export const setIsPending = (isPending: boolean) => useAuthStore.setState({ isPending });
export const setIsSuccess = (isSuccess: boolean) => useAuthStore.setState({ isSuccess });
export const setIsError = (isError: boolean) => useAuthStore.setState({ isError });

export const resetStore = () => useAuthStore.setState({ ...initialState });
