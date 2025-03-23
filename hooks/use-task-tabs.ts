import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export type Tab = "list" | "board" | "kanban" | "calendar" | "table";

interface TaskTabsState {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}


export const useTaskTabs = create<TaskTabsState>()(
  devtools(
    persist(
      (set) => ({
        activeTab: "list",
        setActiveTab: (tab: Tab) => set({ activeTab: tab }),
      }),
      {
        name: "task-tabs",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);


