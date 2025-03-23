"use client";

import { Modal } from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { useDeleteWorkspaceModal } from '@/hooks/use-modals';
import { api } from '@/lib/axios';
import { IAccount } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { toast } from 'sonner';
interface Props {
  workspaceId: string
}
function WorkspaceDeleteSection({ workspaceId }: Props) {
  const deleteWorkspaceModal = useDeleteWorkspaceModal();
  const queryClient = useQueryClient();
  const session = useSession();
  const user = session.data?.user as IAccount;
  const accessToken = user.accessToken;
  if (!accessToken) return null
  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteWorkspace", workspaceId],
    mutationFn: async () => {
      await api.delete(`/api/delete-workspace/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      })
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      })
      window.location.assign("/workspaces");
    }
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex flex-col gap-2">
        <h1 className='text-xl font-semibold text-destructive'>Danger Zone</h1>
        <p className='text-muted-foreground text-sm'>
          Once you delete your workspace, there is no going back. Please be certain.
        </p>
      </div>

      <div className="flex flex-row justify-end">
        <Button variant={"destructive"} type='button' onClick={deleteWorkspaceModal.onOpen} className=''>Delete</Button>
      </div>

      <Modal isOpen={deleteWorkspaceModal.isOpen} onClose={deleteWorkspaceModal.onClose} title='Delete Workspace' description='Are you sure you want to delete this workspace?'>
        <p className='text-muted-foreground text-sm mb-4'>Once you delete your workspace, there is no going back. Please be certain.</p>
        <div className="flex justify-end">
          <Button variant={"destructive"} type='button' onClick={() => mutate()} disabled={isPending}>
            {isPending && <Loader2 className='animate-spin' />}
            Delete
          </Button>

        </div>
      </Modal>
    </div>
  )
}

export default WorkspaceDeleteSection