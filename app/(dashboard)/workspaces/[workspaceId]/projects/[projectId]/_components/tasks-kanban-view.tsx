import ErrorState from '@/components/shared/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { IAccount, ITask } from '@/lib/types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TaskPriority, TaskStatus } from '@/lib/enums';
import { Button } from '@/components/ui/button';
import { TbDots, TbEye, TbHourglassEmpty, TbPencil, TbPlus, TbTrash } from 'react-icons/tb';
import { useSession } from 'next-auth/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateTaskModal, useDeleteTaskModal, useUpdateTaskModal } from '@/hooks/use-modals';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useTaskInitialValues } from '@/hooks/use-task-initial-values';
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/shared/modal';
import { Loader2 } from 'lucide-react';
import TaskForm from '../../../../../../../components/forms/task-form';
import { TaskSchema } from '@/lib/zod';
import { useGetWorkspace } from '@/hooks/use-workspaces';
import { TaskPriorityBadge } from '@/components/shared/task-badges';
import Link from 'next/link';
interface Props {
    tasks?: ITask[],
    isLoading?: boolean
    error?: any
    projectId?: string
    workspaceId: string
}

interface TaskCardProps {
    task: ITask;
    workspaceId: string
    isDragging: boolean;
    setSelectedTask: React.Dispatch<React.SetStateAction<ITask | null>>;
}

function TaskCard({ task, workspaceId, isDragging, setSelectedTask }: TaskCardProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const deleteTaskModal = useDeleteTaskModal();
    const updateTaskModal = useUpdateTaskModal();
    const cardVariants = {
        default: { rotate: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
        dragged: { rotate: '-3deg', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }, // Rotate slightly
    };



    return <>
        <motion.div
            className={cn('w-full bg-background border border-input rounded-md p-4 ', {
                'bg-muted': isDragging,
            })}
            variants={cardVariants}
            initial="default"
            animate={isDragging ? 'dragged' : 'default'}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold'>{task.name}</h3>
                <div className='flex items-center gap-2 flex-1 justify-end'>
                    <TaskPriorityBadge priority={task.priority as TaskPriority} />
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="p-4">
                <p className="text-muted-foreground">{task.description}</p>
            </div>
            <div className="flex items-center flex-row gap-2 p-4">
                <Avatar>
                    <AvatarImage src={task.assignee.account.imageUrl} alt={task.assignee.account.firstName} />
                    <AvatarFallback>{task.assignee.account.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className='font-semibold text-xs'>{task.assignee.account.firstName} {task.assignee.account.lastName}</span>
                    <span className='text-xs text-muted-foreground'>{task.assignee.account.email}</span>
                </div>
            </div>
        </motion.div>


    </>
}


function TasksKanbanView({ tasks, isLoading, error, projectId, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    const queryClient = useQueryClient();
    if (!accessToken) return null;
    const deleteTaskModal = useDeleteTaskModal();
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const updateTaskModal = useUpdateTaskModal();
    const createTaskModal = useCreateTaskModal();
    const taskInitialValues = useTaskInitialValues();
    const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace(workspaceId);
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
        mutationFn: async ({ taskId, args }: { taskId: string, args: Partial<TaskSchema> }) => {
            const response = await api.put(`/api/update-task/${taskId}`, args, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const { result } = await response.data;
            return result
        },
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['get-tasks'],
            });
            setSelectedTask(null);
            updateTaskModal.onClose();
        },
        onError: () => {
            toast.error('Failed to update task');
        }
    })


    const initialTasks = useMemo(() => {
        const itemsMap: Record<TaskStatus, {
            boardValue: TaskStatus,
            boardHeader: string,
            boradItems: ITask[],
            boardItemsCount: number
        }> = {
            [TaskStatus.TODO]: {
                boardValue: TaskStatus.TODO,
                boardHeader: 'To Do',
                boradItems: tasks?.filter(task => task.status === TaskStatus.TODO) || [],
                boardItemsCount: tasks?.filter(task => task.status === TaskStatus.TODO)?.length || 0
            },
            [TaskStatus.IN_PROGRESS]: {
                boardValue: TaskStatus.IN_PROGRESS,
                boardHeader: 'In Progress',
                boradItems: tasks?.filter(task => task.status === TaskStatus.IN_PROGRESS) || [],
                boardItemsCount: tasks?.filter(task => task.status === TaskStatus.IN_PROGRESS)?.length || 0
            },
            [TaskStatus.IN_REVIEW]: {
                boardValue: TaskStatus.IN_REVIEW,
                boardHeader: 'In Review',
                boradItems: tasks?.filter(task => task.status === TaskStatus.IN_REVIEW) || [],
                boardItemsCount: tasks?.filter(task => task.status === TaskStatus.IN_REVIEW)?.length || 0
            },
            [TaskStatus.DONE]: {
                boardValue: TaskStatus.DONE,
                boardHeader: 'Done',
                boradItems: tasks?.filter(task => task.status === TaskStatus.DONE) || [],
                boardItemsCount: tasks?.filter(task => task.status === TaskStatus.DONE)?.length || 0
            },
        }

        // Sort tasks by position
        Object.values(itemsMap).forEach((items) => {
            items.boradItems.sort((a, b) => a.position - b.position);
        });

        return itemsMap;
    }, [tasks, isLoading])

    const [boards, setBoards] = useState(initialTasks);

    const onDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;
        const sourceBoard = boards[source.droppableId as TaskStatus];
        const destinationBoard = boards[destination.droppableId as TaskStatus];

        let updatedTask: ITask;
        if (source.droppableId === destination.droppableId) {
            const newBoardItems = [...sourceBoard.boradItems];
            const [movedTask] = newBoardItems.splice(source.index, 1);
            newBoardItems.splice(destination.index, 0, movedTask);
            sourceBoard.boradItems = newBoardItems;
            updatedTask = movedTask;
        } else {
            const newSourceBoardItems = [...sourceBoard.boradItems];
            const [movedTask] = newSourceBoardItems.splice(source.index, 1);
            sourceBoard.boradItems = newSourceBoardItems;
            destinationBoard.boradItems.splice(destination.index, 0, movedTask);
            updatedTask = movedTask;
        }

        setBoards({
            ...boards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
        });

        if (updatedTask) {
            await updateTask({
                taskId: updatedTask._id,
                args: {
                    name: updatedTask.name,
                    position: destination.index + 1000,
                    status: destination.droppableId as TaskStatus,
                    assigneeId: updatedTask.assignee._id,
                    projectId: updatedTask.project._id,

                }
            })
        }
    }, [boards, updateTask]);

    useEffect(() => {
        setBoards(initialTasks)
    }, [initialTasks])

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
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 overflow-x-auto min-h-[60vh] h-full'>
                    <div className='grid grid-cols-4 gap-4 h-full'>
                        {
                            Object.values(boards).map((board, index) => (
                                <div key={index} className='flex flex-col gap-4 w-full'>
                                    {/* BOARD HEADER */}
                                    <div className='flex items-center gap-4 px-4 py-2 border border-border rounded-sm h-16'>
                                        <h3 className='text-base font-semibold'>{board.boardHeader}</h3>
                                        <span>{board.boardItemsCount} tasks</span>

                                        <div className="ms-auto" >
                                            <Button variant='ghost' size={"icon"} type='button'
                                                onClick={() => {
                                                    taskInitialValues.setStatus(board.boardValue)
                                                    createTaskModal.onOpen()
                                                }}
                                            >
                                                <TbPlus />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* BOARD CONTENT */}
                                    <Droppable droppableId={board.boardValue}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={cn("flex flex-col gap-2 w-full rounded-sm border border-border",
                                                    "bg-muted"
                                                )}
                                            >
                                                {
                                                    board.boardItemsCount === 0 && (
                                                        <div className='flex flex-col items-center justify-center gap-2 w-full h-full p-4'>
                                                            <TbHourglassEmpty className='w-4 h-4 text-muted-foreground' />
                                                            <p className='text-sm text-muted-foreground'>No tasks found</p>
                                                        </div>
                                                    )
                                                }
                                                {board.boradItems.map((task, index) => (
                                                    // TASK CARDS
                                                    task && (
                                                        <Draggable key={index} draggableId={task?._id} index={index}>
                                                            {
                                                                (provided, snapshot) => <div
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}
                                                                    className='p-4'
                                                                >
                                                                    <TaskCard task={task}
                                                                        isDragging={snapshot.isDragging}
                                                                        setSelectedTask={setSelectedTask}
                                                                        workspaceId={workspaceId}
                                                                    />
                                                                </div>
                                                            }
                                                        </Draggable>
                                                    )
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>


                            ))
                        }
                    </div>
                </div>
            </DragDropContext>

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

export default TasksKanbanView