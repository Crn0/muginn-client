import { initSettingsTabStore, type ISettingsTabStore } from "./settings-tab";

const initialState = {
  leftTab: "myAccount",
  rightTab: "security",
} as const;

export type TUserSettingsTabStore = () => ISettingsTabStore;

export const useUserSettingsTabStore = initSettingsTabStore(
  "UserSettingsTab",
  initialState
) satisfies TUserSettingsTabStore;
