import { initSettingsTabStore, type ISettingsTabStore } from "./settings-tab";

const initialState = {
  leftTab: "chatProfile",
  rightTab: "profile",
} as const;

export type TUseChatSettingsTabStore = () => ISettingsTabStore;

export const useChatSettingsTabStore = initSettingsTabStore(
  "ChatSettingsTab",
  initialState
) satisfies TUseChatSettingsTabStore;
