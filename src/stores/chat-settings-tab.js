import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  leftTab: "chatProfile",
  rightTab: "profile",
};

export default create(
  devtools(
    (set) => ({
      ...initialState,
      setLeftTab: (leftTab) => set(() => ({ leftTab })),
      setRightTab: (rightTab) => set(() => ({ rightTab })),
      setTabs: ({ leftTab, rightTab }) => set(() => ({ leftTab, rightTab })),
      reset: () => set(() => ({ ...initialState })),
    }),
    { name: "ChatSettingsTab" }
  )
);
