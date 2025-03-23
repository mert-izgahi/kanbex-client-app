"use client"

import { TaskPriorityBadge, TaskStatusBadge } from '@/components/shared/task-badges'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { MediaType, Role, TaskPriority, TaskStatus } from '@/lib/enums'
import { ITask } from '@/lib/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { Button } from '@/components/ui/button'
import { TbDots, TbSettings2 } from 'react-icons/tb'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import { Badge } from '@/components/ui/badge'
import { useUpdateTaskModal } from '@/hooks/use-modals'
import { Modal } from '@/components/shared/modal'
import TaskForm from '../../../../../../../components/forms/task-form'
interface TaskDetailsProps {
    task: ITask
    accessToken: string
    currentAccountPermission: Role
}
function TaskDetails({ task, accessToken, currentAccountPermission }: TaskDetailsProps) {
    if (!task) return null
    const queryClient = useQueryClient();
    const updateTaskModal = useUpdateTaskModal();
    const router = useRouter();
    const { mutate: setStatusInProgress, isPending: isPendingInProgress } = useMutation({
        mutationFn: async () => {
            return api.put(`/api/update-task-status/${task?._id}`, {
                status: TaskStatus.IN_PROGRESS
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['my-tasks', task?.workspace._id],
            });
            router.refresh();
        },
    });


    const { mutate: setStatusInReview, isPending: isPendingInReview } = useMutation({
        mutationFn: async () => {
            return api.put(`/api/update-task-status/${task?._id}`, {
                status: TaskStatus.IN_REVIEW
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['my-tasks', task?.workspace._id],
            });
            router.refresh();
        },
    });
    return (
        <div className='flex flex-col gap-6'>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className='text-2xl font-semibold'>{task?.name}</h1>
                    <span className='text-sm text-muted-foreground'>{dayjs(task?.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                <div className="ms-auto flex items-center gap-2">
                    {
                        currentAccountPermission !== Role.MEMBER && (
                            <>
                                <Button size={"icon"} variant={'ghost'} onClick={() => updateTaskModal.onOpen()}>
                                    <TbSettings2 className='w-4 h-4' />
                                </Button>
                                <Modal
                                    isOpen={updateTaskModal.isOpen}
                                    onClose={updateTaskModal.onClose}
                                    title='Update Task'
                                    description='Update your task'
                                >
                                    <TaskForm projectId={task?.project._id} workspaceId={task?.workspace._id} mode="edit" taskId={task?._id} />
                                </Modal>
                            </>

                        )
                    }
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <TbDots className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setStatusInProgress()
                            }}>
                                <TbSettings2 className='w-4 h-4 mr-2' />
                                Set In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setStatusInReview()
                            }}>
                                <TbSettings2 className='w-4 h-4 mr-2' />
                                Set In Review
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex flex-row items-center gap-2">
                <TaskPriorityBadge priority={task?.priority as TaskPriority} />
                <TaskStatusBadge status={task?.status as TaskStatus} />
                <Badge className='rounded-sm ms-auto'>
                    due date {dayjs(task?.dueDate).format('DD/MM/YYYY')}
                </Badge>
            </div>

            {
                task?.media && (
                    <AspectRatio ratio={16 / 9} className='mb-12'>
                        {
                            task?.mediaType === MediaType.IMAGE && (
                                <img
                                    src={task?.media}
                                    alt={task?.name}
                                    className="w-full h-full object-cover"
                                />
                            )
                        }

                        {
                            task?.mediaType === MediaType.VIDEO && (
                                <video
                                    src={task?.media}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            )
                        }

                        {
                            task?.mediaType === MediaType.DOCUMENT && (
                                <iframe
                                    src={task?.media}
                                    title={task?.name}
                                    className="w-full h-full"
                                />
                            )
                        }


                    </AspectRatio>
                )
            }

            <div className='flex flex-col gap-2'>
                <p className='font-semibold'>Description</p>
                <p className='text-muted-foreground'>{task?.description}</p>
            </div>
        </div>
    )
}

export default TaskDetails