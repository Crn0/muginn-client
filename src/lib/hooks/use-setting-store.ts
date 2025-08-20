import { useContext } from "react";
import { useStore } from "zustand";

import { SettingStoreContext, type ISettingTab } from "@/lib/provider/setting-tab";

const useSettingStore = <T>(selector: (state: ISettingTab) => T): T => {
  const store = useContext(SettingStoreContext);

  if (!store) {
    throw new Error("Missing SettingStoreProvider");
  }

  return useStore(store, selector);
};

export const useSettingTabs = () =>
  useSettingStore(({ leftTab, rightTab }) => ({ leftTab, rightTab }));

export const useSettingActions = () => useSettingStore(({ actions }) => actions);
