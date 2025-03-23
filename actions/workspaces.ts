"use server";

import { IWorkspace } from "@/lib/types";
import axios from "axios";
import { redirect } from "next/navigation";

export const getWorkspaceAction = async ({
  accessToken,
  workspaceId,
}: {
  accessToken: string;
  workspaceId: string;
}): Promise<IWorkspace> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/get-workspace/${workspaceId}`,
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
