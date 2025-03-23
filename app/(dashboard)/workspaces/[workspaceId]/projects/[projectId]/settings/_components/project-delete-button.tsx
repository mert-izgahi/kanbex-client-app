"use client";

import { Modal } from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { useDeleteProjectModal } from '@/hooks/use-modals';
import { api } from '@/lib/axios';
import { IAccount } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { toast } from 'sonner';

interface Props {
    projectId: string
    workspaceId: string
}
function ProjectDeleteButton({ projectId,workspaceId }: Props) {
    const deleteProjectModal = useDeleteProjectModal();
    const queryClient = useQueryClient();
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user.accessToken;
    if (!accessToken) return null
    const { mutate, isPending } = useMutation({
        mutationKey: ["deleteProject", projectId],
        mutationFn: async () => {
            await api.delete(`/api/delete-project/${projectId}?workspaceId=${workspaceId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            })
        },
        onSuccess: () => {
            toast.success("Project deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["projects",workspaceId],
            })
            window.location.assign("/workspaces");
        }
    })
    return (
        <>
            <Button variant={"destructive"} type='button' onClick={deleteProjectModal.onOpen}>Delete</Button>
            <Modal isOpen={deleteProjectModal.isOpen} onClose={deleteProjectModal.onClose} title='Delete Workspace' description='Are you sure you want to delete this workspace?'>
                <p className='text-muted-foreground text-sm mb-4'>Once you delete your project, there is no going back. Please be certain.</p>
                <div className="flex justify-end">
                    <Button variant={"destructive"} type='button' onClick={() => mutate()} disabled={isPending}>
                        {isPending && <Loader2 className='animate-spin' />}
                        Delete
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default ProjectDeleteButton