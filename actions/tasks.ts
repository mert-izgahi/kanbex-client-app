"use server";

import { ITask } from "@/lib/types";
import axios from "axios";
import { redirect } from "next/navigation";

export const getTaskAction = async ({taskId,accessToken}:{taskId:string;accessToken:string}): Promise<ITask> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-task/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { result } = await response.data;
    return result;
  } catch (error) {
    redirect("/workspaces");
  }
};
