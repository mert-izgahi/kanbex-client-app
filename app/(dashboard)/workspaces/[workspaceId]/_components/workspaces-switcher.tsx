"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/axios';
import { IAccount, IWorkspace } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react'

interface WorkspaceSwitcherProps {
    selectedWorkspaceId: string
}

function WorkspaceSwitcher({ selectedWorkspaceId }: WorkspaceSwitcherProps) {

    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;

    const onSelect = (id: string) => {
        window.location.assign(`/workspaces/${id}`);
    }


    const { data: workspaces, isLoading } = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await api.get("/api/get-workspaces", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken
    })

    if (isLoading) return <Skeleton className="h-8 w-full" />

    return (
        <Select onValueChange={onSelect} value={selectedWorkspaceId}>
            <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select workspace" />
            </SelectTrigger>

            <SelectContent>
                {workspaces?.map((workspace: IWorkspace) => (
                    <SelectItem key={workspace._id} value={workspace._id}>
                        <div className='flex items-center gap-2'>
                            <Avatar className='h-6 w-6'>
                                <AvatarImage src={workspace.imageUrl} />
                                <AvatarFallback>
                                    {workspace.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {workspace.name}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export default WorkspaceSwitcher