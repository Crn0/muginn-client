import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface ISettingsTabStore {
  leftTab: string;
  rightTab: string;

  setLeftTab: (state: string) => void;
  setRightTab: (state: string) => void;
  setTabs: ({ leftTab, rightTab }: { leftTab: string; rightTab: string }) => void;
  reset: () => void;
}

export interface InitialState {
  readonly leftTab: string;
  readonly rightTab: string;
}

export const initSettingsTabStore = (name: string, initialState: InitialState) =>
  create(
    devtools<ISettingsTabStore>(
      (set) => ({
        ...initialState,
        setLeftTab: (leftTab) => set(() => ({ leftTab })),
        setRightTab: (rightTab) => set(() => ({ rightTab })),
        setTabs: ({ leftTab, rightTab }) => set(() => ({ leftTab, rightTab })),
        reset: () => set(() => ({ ...initialState })),
      }),
      { name }
    )
  );
