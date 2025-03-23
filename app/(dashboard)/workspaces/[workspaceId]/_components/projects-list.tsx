"use client";

import { Modal } from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useProjectModal } from '@/hooks/use-modals';
import { IAccount, IProject, IWorkspace } from '@/lib/types'
import React, { useMemo } from 'react'
import { TbPlus, TbHourglassEmpty, TbFolder, TbFolderOpen } from 'react-icons/tb';
import { CreateProjectForm } from '../../../../../components/forms/create-project-form';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
interface ProjectsListProps {
    workspace: IWorkspace
}

function ProjectsList({ workspace }: ProjectsListProps) {
    if (!workspace) return null;
    const pathname = usePathname();
    const projectModal = useProjectModal();
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects", workspace._id],
        queryFn: async () => {
            const response = await api.get(`/api/get-projects?workspace=${workspace._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken
    });

    const isEmpty = useMemo(() => {
        return projects?.length === 0
    }, [projects])

    return (

        <>
            <SidebarGroup className='flex-1 h-full'>
                <div className="flex items-center justify-between">
                    <SidebarGroupLabel>
                        {workspace.name} Projects
                    </SidebarGroupLabel>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button type='button' size={"icon"} variant={"ghost"} onClick={projectModal.onOpen}>
                                <TbPlus className='w-4 h-4' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='right'>Create Project</TooltipContent>
                    </Tooltip>
                </div>
                <SidebarMenu className='h-full'>
                    {
                        isLoading && <div>
                            {new Array(5).fill(0).map((_, index) => (
                                <Skeleton key={index} className='mb-2' />
                            ))}
                        </div>
                    }
                    <ScrollArea className='flex-1 h-full'>
                        {
                            !isEmpty && projects?.map((project: IProject) => (
                                <SidebarMenuItem key={project._id}>
                                    <SidebarMenuButton asChild className={cn('cursor-pointer rounded-sm', { 'bg-sidebar-accent': pathname === `/workspaces/${workspace._id}/projects/${project._id}` })}>
                                        <Link href={`/workspaces/${workspace._id}/projects/${project._id}`}>
                                            {
                                                pathname.includes(project._id) ? <TbFolderOpen className='w-4 h-4' /> : <TbFolder className='w-4 h-4' />
                                            }
                                            <span className='truncate text-xs font-medium'>{project.name}</span>
                                            <div className="ms-auto">
                                                <div className={cn('w-2 h-2 rounded-full',
                                                    project.color && `bg-${project.color}-500`
                                                )} />
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }

                        {
                            isEmpty && <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex items-center">
                                        <TbHourglassEmpty className='w-4 h-4' />
                                        <span className='truncate text-xs font-medium'>No projects found</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        }
                    </ScrollArea>
                </SidebarMenu>
            </SidebarGroup>
            <Modal title='Create Project' description='Create a project by filling out the form below' isOpen={projectModal.isOpen}
                onClose={projectModal.onClose}
            >
                <CreateProjectForm workspace={workspace} />
            </Modal>
        </>
    )
}

export default ProjectsList