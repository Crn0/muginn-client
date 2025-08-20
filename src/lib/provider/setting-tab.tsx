import { createContext, useState, type PropsWithChildren } from "react";
import { createStore, type StoreApi } from "zustand";

export interface ISettingTab {
  leftTab: string;
  rightTab: string;
  actions: {
    changeTabs: ({ leftTab, rightTab }: { leftTab: string; rightTab: string }) => void;
    resetTabs: () => void;
  };
}

export interface SettingStoreProviderProps extends PropsWithChildren {
  initialTab: {
    leftTab: string;
    rightTab: string;
  };
}

export const SettingStoreContext = createContext<StoreApi<ISettingTab> | null>(null);

export const SettingStoreProvider = ({ initialTab, children }: SettingStoreProviderProps) => {
  const [store] = useState(() =>
    createStore<ISettingTab>((set) => ({
      ...initialTab,
      actions: {
        changeTabs: ({ leftTab, rightTab }) => set({ leftTab, rightTab }),
        resetTabs: () => set({ ...initialTab }),
      },
    }))
  );

  return <SettingStoreContext.Provider value={store}>{children}</SettingStoreContext.Provider>;
};
