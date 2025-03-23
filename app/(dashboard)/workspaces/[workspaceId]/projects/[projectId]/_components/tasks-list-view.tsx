"use client"

import ErrorState from '@/components/shared/error-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDeleteTaskModal, useUpdateTaskModal } from '@/hooks/use-modals'
import { TaskPriority, TaskStatus } from '@/lib/enums'
import { IAccount, ITask } from '@/lib/types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TbArrowDown, TbArrowUp, TbDots, TbEye, TbPencil, TbSettings2, TbTrash } from 'react-icons/tb'
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { motion } from 'framer-motion';
import { Modal } from '@/components/shared/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import TaskForm from '../../../../../../../components/forms/task-form'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link'
interface TaskListItemProps {
    task: ITask;
    workspaceId: string
    isDragging: boolean;
    setSelectedTask: React.Dispatch<React.SetStateAction<ITask | null>>;
    onMoveUp?: () => void;
    onMoveDown?: () => void
    onUpdateTask: ({ taskId, args }: { taskId: string, args: { position: number, status: TaskStatus } }) => void
}


function TaskListItem({ task, workspaceId, isDragging, setSelectedTask, onMoveDown, onMoveUp, onUpdateTask }: TaskListItemProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const deleteTaskModal = useDeleteTaskModal();
    const updateTaskModal = useUpdateTaskModal();
    const priority = useMemo(() => {
        switch (task.priority) {
            case TaskPriority.LOW:
                return 'Low';
            case TaskPriority.MEDIUM:
                return 'Medium';
            case TaskPriority.HIGH:
                return 'High';
        }
    }, [task.status]);

    const status = useMemo(() => {
        switch (task.status) {
            case TaskStatus.TODO:
                return 'To Do';
            case TaskStatus.IN_PROGRESS:
                return 'In Progress';
            case TaskStatus.IN_REVIEW:
                return "In Review";
            case TaskStatus.DONE:
                return 'Done';
        }
    }, [task.status]);


    return <motion.div
        initial="default"
        animate={isDragging ? 'dragged' : 'default'}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className='flex flex-row gap-4 p-4 border border-border rounded-sm'>

        <div className="flex flex-col gap-2">
            <Button variant="ghost" size={"icon"} onClick={onMoveUp}>
                <TbArrowUp />
            </Button>
            <Button variant="ghost" size={"icon"} onClick={onMoveDown}>
                <TbArrowDown />
            </Button>
        </div>

        <div className='flex flex-col gap-2 w-full'>
            <div className="flex flex-row gap-2 w-full">
                <Avatar>
                    <AvatarImage src={task.assignee.account.imageUrl} alt={task.assignee.account.firstName} />
                    <AvatarFallback>{task.assignee.account.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className='font-semibold text-xl'>{task.name}</h1>
                <div className="ms-auto">
                    {/* ActionsMenu */}
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
                                onUpdateTask({ taskId: task._id, args: { position: task.position, status: TaskStatus.DONE } })
                                toast.success('Task updated successfully');
                            }}>
                                <TbSettings2 className='w-4 h-4 mr-2' />
                                Set As Done
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* <span className='text-muted-foreground text-xs'>{dayjs(task?.createdAt).fromNow()}</span> */}
            <p className='text-muted-foreground text-sm'>
                {task.description}
            </p>

            <div className="flex flex-row gap-2">
                <Badge>{priority}</Badge>
                <Badge>{status}</Badge>
            </div>
        </div>
    </motion.div>
}

interface Props {
    tasks?: ITask[],
    isLoading?: boolean
    error?: any
    projectId?: string
    workspaceId: string
}
function TasksListView({ tasks, isLoading, error, projectId, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const deleteTaskModal = useDeleteTaskModal();
    const updateTaskModal = useUpdateTaskModal();

    const initialTasksList = useMemo(() => {
        return tasks
    }, [tasks]);

    const [tasksList, setTasksList] = useState<ITask[]>(initialTasksList || []);


    // Mutations
    const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
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
            setSelectedTask(null);
            deleteTaskModal.onClose();
        },
    });
    const { mutate: updateTask, isPending: updateTaskPending } = useMutation({
        mutationKey: ["updateTask"],
        mutationFn: async ({ taskId, args }: { taskId: string, args: { position: number, status: TaskStatus } }) => {
            const response = await api.put(`/api/update-task/${taskId}`, args, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { result } = await response.data;
            return result
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['get-tasks', projectId],
            });
            setSelectedTask(null);
            updateTaskModal.onClose();
        },
        onError: () => {
            toast.error('Failed to update task');
        }
    })

    // Drag and Drop API
    const onDragEnd = useCallback(
        async (result: DropResult) => {
            if (!result.destination) return;

            const { source, destination } = result;
            const newTasks = [...tasksList];
            const [movedTask] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, movedTask);
            setTasksList(newTasks);

            // update task
            await updateTask({ taskId: movedTask._id, args: { position: destination.index, status: movedTask.status as TaskStatus } })
        },
        [tasksList, setTasksList, updateTask]
    );

    const handleMoveUp = (index: number) => {
        if (index > 0) {
            const newTasks = [...tasksList];
            [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
            setTasksList(newTasks);
            // Update task positions in the backend
            updateTask({
                taskId: newTasks[index]._id,
                args: {
                    position: index + 1000,
                    status: newTasks[index].status as TaskStatus,
                },
            });
            updateTask({
                taskId: newTasks[index - 1]._id,
                args: {
                    position: index - 1 + 1000,
                    status: newTasks[index - 1].status as TaskStatus,
                },
            });

            toast.success('Task updated successfully');
        }
    };

    const handleMoveDown = (index: number) => {
        if (index < tasksList.length - 1) {
            const newTasks = [...tasksList];
            [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
            setTasksList(newTasks);

            // Update task positions in the backend
            updateTask({
                taskId: newTasks[index]._id,
                args: {
                    position: index + 1000,
                    status: newTasks[index].status as TaskStatus,
                },
            });
            updateTask({
                taskId: newTasks[index + 1]._id,
                args: {
                    position: index + 1 + 1000,
                    status: newTasks[index + 1].status as TaskStatus,
                },
            });

            toast.success('Task updated successfully');
        }
    };


    useEffect(() => {
        setTasksList(initialTasksList || [])
    }, [initialTasksList])

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
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
                {
                    (provider) => <div
                        {...provider.droppableProps}
                        ref={provider.innerRef}
                        className='grid grid-cols-1 gap-4'
                    >
                        {
                            tasksList && tasksList.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {
                                        (dragProvider, snapshot) => <div
                                            {...dragProvider.draggableProps}
                                            {...dragProvider.dragHandleProps}
                                            ref={dragProvider.innerRef}
                                        >
                                            <TaskListItem
                                                task={task}
                                                workspaceId={workspaceId}
                                                isDragging={snapshot.isDragging}
                                                setSelectedTask={setSelectedTask}
                                                onMoveUp={() => handleMoveUp(index)}
                                                onMoveDown={() => handleMoveDown(index)}
                                                onUpdateTask={updateTask}
                                            />
                                        </div>
                                    }
                                </Draggable>
                            ))
                        }
                    </div>
                }
            </Droppable>

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
        </DragDropContext>
    )
}

export default TasksListView