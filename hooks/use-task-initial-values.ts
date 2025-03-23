import {create} from "zustand";

interface ITaskInitialValues {
    taskId:string;
    setTaskId:(taskId:string) => void
    status:string;
    setStatus:(status:string) => void
}

export const useTaskInitialValues = create<ITaskInitialValues>((set) => ({
    taskId: "",
    setTaskId: (taskId) => set({taskId}),
    status: "",
    setStatus: (status) => set({status})
}));