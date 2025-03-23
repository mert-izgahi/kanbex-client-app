"use client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { api } from "@/lib/axios";
import { IAccount, IWorkspace } from "@/lib/types";
interface UseGetWorkspacesReturn {
  data: IWorkspace[] | undefined;
  isLoading: boolean;
  error: unknown;
}
export const useGetWorkspaces = (): UseGetWorkspacesReturn => {
  const session = useSession();
  const user = session.data?.user as IAccount;
  if (!user) return { data: [], isLoading: false, error: null };
  const accessToken = user.accessToken;
  return useQuery<IWorkspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await api.get("/api/get-workspaces", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { result } = await response.data;
      return result;
    },
    enabled: !!accessToken,
  });
};

export const useGetWorkspace = (workspaceId: string) => {
  const session = useSession();
  const user = session.data?.user as IAccount;
  if (!user) return { data: null, isLoading: false, error: null };
  const accessToken = user.accessToken;
  return useQuery<IWorkspace>({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await api.get(`/api/get-workspace/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { result } = await response.data;
      return result;
    },
    enabled: !!accessToken,
  });
};




