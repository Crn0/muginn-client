import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  token: null,
  isRefreshingToken: false,
};

export const useAuthStore = create(
  devtools((set) => ({
    ...initialState,
    setToken: (token) => set(() => ({ token })),
    setIsRefreshingToken: (isRefreshingToken) => set(() => ({ isRefreshingToken })),
    reset: () => {
      set(initialState);
    },
  }))
);

export const getToken = () => useAuthStore.getState().token;
export const getIsRefreshingToken = () => useAuthStore.getState().isRefreshingToken;

export const setToken = (token) => useAuthStore.setState({ token });
export const setIsRefreshingToken = (isRefreshingToken) =>
  useAuthStore.setState({ isRefreshingToken });

export const resetStore = () => useAuthStore.setState({ ...initialState });
