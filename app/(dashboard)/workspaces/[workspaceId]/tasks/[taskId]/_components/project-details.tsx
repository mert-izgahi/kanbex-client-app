"use client"

import MembersGroup, { MemberGroupItem } from '@/components/ui/members-group';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/axios';
import { IAccount, IProject } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react'
interface ProjectDetailsProps {
    projectId: string
}
function ProjectDetails({ projectId }: ProjectDetailsProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null

    const { data: project, isLoading } = useQuery<IProject>({
        queryKey: ['project-members', projectId],
        queryFn: async () => {
            const response = await api.get(`/api/get-project/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        }
    })

    if (isLoading) {
        return (
            <div className='flex flex-col gap-4'>
                {
                    new Array(5).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-12" />
                    ))
                }
            </div>
        )
    }
    return (
        <div className='flex flex-col gap-6'>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Project Name</p>
                <p className="text-sm font-medium">{project?.name}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Project Description</p>
                <p className="text-sm font-medium">{project?.description}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Project Members</p>
                <MembersGroup members={project?.projectMembers!} />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Workspace Members</p>
                <MembersGroup members={project?.workspaceMembers!} />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Workspace Admin</p>
                <div className='flex justify-start'>
                    <MemberGroupItem member={project?.workspaceAdmin!} />
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails