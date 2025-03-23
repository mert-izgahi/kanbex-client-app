"use client"

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { api } from '@/lib/axios'
import { useSession } from 'next-auth/react'
import { IAccount, IProject } from '@/lib/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TbPlus, TbSettings } from 'react-icons/tb'
import { useCreateTaskModal } from '@/hooks/use-modals'
import { Modal } from '@/components/shared/modal'
import TaskForm from '../../../../../../../components/forms/task-form'
dayjs.extend(relativeTime)
interface ProjectHeaderProps {
    projectId: string
    workspaceId: string
    isAdmin: boolean
}
function ProjectHeader({ projectId, workspaceId, isAdmin }: ProjectHeaderProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const acssessToken = user?.accessToken;
    if (!acssessToken) return null;
    const taskModel = useCreateTaskModal();

    const { data: project, isLoading } = useQuery<IProject>({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await api.get(`/api/get-project/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${acssessToken}`
                }
            })
            const { result } = await response.data;
            return result;
        },
        enabled: !!acssessToken
    });


    return (
        <div className='flex items-start justify-between'>
            <div className="flex flex-col gap-2">
                <h1 className='font-semibold text-xl'>{project?.name}</h1>
                <span className='text-muted-foreground text-xs'>{dayjs(project?.createdAt).fromNow()}</span>
                <p className='text-muted-foreground text-sm'>
                    {project?.description}
                </p>
            </div>

            <div className="flex flex-row gap-2">
                <Button type='button' variant={"success"} onClick={taskModel.onOpen}>
                    <TbPlus className='w-4 h-4 mr-1' />
                    New Task
                </Button>
                <Modal title='Create Task' description='create a new task' isOpen={taskModel.isOpen} onClose={taskModel.onClose}>
                    <TaskForm projectId={projectId} workspaceId={workspaceId} mode='create' />
                </Modal>
                {
                    isAdmin && <Button asChild variant={"secondary"}>
                        <Link href={`/workspaces/${project?.workspace?._id}/projects/${project?._id}/settings`}>
                            <TbSettings className='w-4 h-4' />
                            Project Settings
                        </Link>
                    </Button>
                }
            </div>
        </div>
    )
}

export default ProjectHeader