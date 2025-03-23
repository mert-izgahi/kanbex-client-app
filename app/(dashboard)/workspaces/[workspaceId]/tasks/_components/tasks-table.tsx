"use client"
import ErrorState from '@/components/shared/error-state'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/shared/task-badges'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/axios'
import { TaskPriority, TaskStatus } from '@/lib/enums'
import { IAccount, ITask } from '@/lib/types'
import { cn } from '@/lib/utils'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { TbDots, TbEye, TbSettings2 } from 'react-icons/tb'
import { toast } from 'sonner'
interface Props {
    workspaceId: string
}



function TaskTableRow({ task, accessToken }: { task: ITask, accessToken: string }) {
    const queryClient = useQueryClient();
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
        },
    });

    return <TableRow>
        <TableCell>{task.name}</TableCell>
        <TableCell>{task.project.name}</TableCell>
        <TableCell>{task.workspace.name}</TableCell>
        <TableCell>
            <TaskPriorityBadge priority={task.priority as TaskPriority} />
        </TableCell>
        <TableCell>
            <TaskStatusBadge status={task.status as TaskStatus} />
        </TableCell>
        <TableCell>{dayjs(task.dueDate).format("DD-MM-YYYY")}</TableCell>
        <TableCell>{dayjs(task.createdAt).format("DD-MM-YYYY")}</TableCell>
        <TableCell>
            <div className='flex items-center gap-2'>
                <Button asChild size={"icon"} variant='ghost'>
                    <Link href={`/workspaces/${task.workspace._id}/tasks/${task._id}`}>
                        <TbEye className='h-4 w-4' />
                    </Link>
                </Button>

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

        </TableCell>
    </TableRow>
}

function TasksTable({ workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const dueDate = searchParams.get("dueDate") || undefined;
    const { data: tasks, isLoading, error: loadingError } = useQuery<ITask[]>({
        queryKey: ["my-tasks", workspaceId, search, status, priority, dueDate],
        queryFn: async () => {
            const response = await api.get(`/api/get-my-tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    params: {
                        workspaceId,
                        search,
                        status,
                        priority,
                        dueDate
                    }
                }
            )
            const { result } = await response.data;
            return result
        },
        enabled: !!workspaceId
    })




    if (isLoading) {
        return <div className='w-full flex flex-col gap-2'>
            {new Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
            ))}
        </div>
    }

    if (loadingError) return <ErrorState error={loadingError} />

    return (
        <div className='w-full flex flex-col'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead className="w-[100px]">Project</TableHead>
                        <TableHead className="w-[100px]">Workspace</TableHead>
                        <TableHead className="w-[100px]">Priority</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[100px]">Due Date</TableHead>
                        <TableHead className="w-[100px]">Created Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks?.map((task) => (
                        <TaskTableRow key={task._id} task={task} accessToken={accessToken} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TasksTable