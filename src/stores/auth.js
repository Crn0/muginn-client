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

export const useAuthStore = create(
  devtools((set) => ({
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

export const setToken = (token) => useAuthStore.setState({ token });
export const setError = (error) => useAuthStore.setState({ error });
export const setIsRefreshingToken = (isRefreshingToken) =>
  useAuthStore.setState({ isRefreshingToken });
export const setIsPending = (isPending) => useAuthStore.setState({ isPending });
export const setIsSuccess = (isSuccess) => useAuthStore.setState({ isSuccess });
export const setIsError = (isError) => useAuthStore.setState({ isError });

export const resetStore = () => useAuthStore.setState({ ...initialState });
