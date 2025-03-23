import ErrorState from '@/components/shared/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { IAccount, ITask } from '@/lib/types'
import React, { useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from '@/components/shared/data-table'
import dayjs from 'dayjs'
import { Badge } from '@/components/ui/badge'
import { TaskPriority, TaskStatus } from '@/lib/enums'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TbDots, TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import { useDeleteTaskModal, useUpdateTaskModal } from '@/hooks/use-modals'
import { Modal } from '@/components/shared/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Loader2, Settings2 } from 'lucide-react'
import TaskForm from '../../../../../../../components/forms/task-form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/shared/task-badges'
import Link from 'next/link'

interface Props {
    tasks?: ITask[],
    isLoading?: boolean
    error?: any
    projectId?: string
    workspaceId: string
}



function TasksTableView({ tasks, isLoading, error, projectId, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    const deleteTaskModal = useDeleteTaskModal();
    const updateTaskModal = useUpdateTaskModal();

    const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTask", selectedTask?._id],
        mutationFn: async () => {
            return api.delete(`/api/delete-task/${selectedTask?._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Task deleted successfully');
            queryClient.invalidateQueries({
                queryKey: ['get-tasks', selectedTask?.project],
            });
            deleteTaskModal.onClose();
        },
    });

    const { mutateAsync: updateTask, isPending: isUpdating } = useMutation({
        mutationKey: ["updateTask", selectedTask?._id],
        mutationFn: async (data: any) => {
            return api.put(`/api/update-task/${selectedTask?._id}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['get-tasks', selectedTask?.project],
            });
            updateTaskModal.onClose();
        },
    });
    const columns: ColumnDef<ITask>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'assignee',
            header: 'Assignee',
            cell: ({ row }) => {
                const assignee = row.original.assignee;
                return <div className='flex flex-row items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={assignee.account.imageUrl} alt={assignee.account.firstName} />
                        <AvatarFallback>{assignee.account.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className='font-semibold text-xs'>{assignee.account.firstName} {assignee.account.lastName}</span>
                        <span className='text-xs text-muted-foreground'>{assignee.account.email}</span>
                    </div>
                </div>
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.original.status;

                return (
                    <TaskStatusBadge status={status as TaskStatus} />
                );
            }
        },
        {
            accessorKey: 'priority',
            header: 'Priority',
            cell: ({ row }) => {
                const priority = row.original.priority;

                return (
                    <TaskPriorityBadge priority={priority as TaskPriority} />
                );
            }
        },
        {
            accessorKey: 'dueDate',
            header: 'Due Date',
            cell: ({ row }) => {
                const dueDate = row.original.dueDate;
                return dueDate ? dayjs(dueDate).format('YYYY-MM-DD') : null;
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => {
                const createdAt = row.original.createdAt;
                return createdAt ? dayjs(createdAt).format('YYYY-MM-DD') : null;
            },
        },

        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const task = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={"icon"} variant={"ghost"}>
                                <TbDots className='w-4 h-4' />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer' asChild>
                                <Link href={`/workspaces/${workspaceId}/tasks/${task._id}`}>
                                    <TbEye className='w-4 h-4 mr-2' />
                                    View
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setSelectedTask(task)
                                updateTaskModal.onOpen()
                            }}>
                                <TbPencil className='w-4 h-4 mr-2' />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setSelectedTask(task)
                                deleteTaskModal.onOpen()
                            }}>
                                <TbTrash className='w-4 h-4 mr-2' />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                setSelectedTask(task)
                                updateTask({
                                    status: TaskStatus.DONE
                                })
                            }}>
                                <Settings2 className='w-4 h-4 mr-2' />
                                Set As Done
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },

    ]




    if (error) {
        return <ErrorState error={error} />
    }

    if (isLoading) {
        return <div className='flex flex-col gap-4'>
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-12" />
                ))
            }
        </div>
    }
    return (
        <>
            {tasks && <DataTable columns={columns} data={tasks} sortableIds={["dueDate", "createdAt"]} />}
            <Modal isOpen={deleteTaskModal.isOpen} onClose={() => {
                setSelectedTask(null)
                deleteTaskModal.onClose()
            }} title='Delete Task' description='Are you sure you want to delete this task?'>
                <p className='text-sm text-muted-foreground'>
                    {selectedTask?.name} Will be deleted permanently from the database
                </p>
                <div className='flex flex-row items-center justify-end gap-2'>
                    <Button onClick={async () => await deleteTask()} variant='destructive'>
                        {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Delete
                    </Button>
                </div>
            </Modal>

            <Modal isOpen={updateTaskModal.isOpen} onClose={() => {
                setSelectedTask(null)
                updateTaskModal.onClose()
            }} title='Edit Task' description='edit task'>
                {selectedTask && <TaskForm projectId={projectId!} workspaceId={workspaceId} mode='edit' taskId={selectedTask._id} />}
            </Modal>

        </>
    )
}

export default TasksTableView