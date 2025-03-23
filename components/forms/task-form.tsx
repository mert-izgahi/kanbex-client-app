"use client";

import { useCreateTaskModal, useUpdateTaskModal } from '@/hooks/use-modals'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, TaskSchema } from '@/lib/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IAccount, IMember, ITask } from '@/lib/types';
import dayjs from 'dayjs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaType, TaskPriority, TaskStatus } from '@/lib/enums';
import DatePicker from '@/components/shared/date-picker';
import { Loader2 } from 'lucide-react';
import { useTaskInitialValues } from '@/hooks/use-task-initial-values';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ImageInput from '@/components/ui/image-input';
import DocumentInput from '@/components/ui/document-input';
import VideoInput from '@/components/ui/video-input';
interface Props {
    projectId: string
    workspaceId: string
    mode: "create" | "edit"
    taskId?: string
}
function TaskForm({ projectId, workspaceId, mode, taskId }: Props) {
    const queryClient = useQueryClient();
    const createTaskModal = useCreateTaskModal();
    const updateTaskModal = useUpdateTaskModal();
    const { status: initialStatus } = useTaskInitialValues();
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user.accessToken;
    if (!accessToken) return null;

    const { data: members, isLoading } = useQuery<IMember[]>({
        queryKey: ["members", workspaceId],
        queryFn: async () => {
            const response = await api.get(`/api/get-members?workspace=${workspaceId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken
    });

    const { data: task, isLoading: taskLoading } = useQuery<ITask>({
        queryKey: ["task", taskId],
        queryFn: async () => {
            const response = await api.get(`/api/get-task/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: mode === "edit" && !!taskId
    });

    const { mutate: createTask, isPending: isCreatePending } = useMutation({
        mutationFn: async (data: TaskSchema) => {
            const response = await api.post(`/api/create-task`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result;
        },
        onSuccess: () => {
            toast.success("Task created successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-tasks", projectId],
            })
            form.reset();
            createTaskModal.onClose();
        }
    });

    const { mutate: updateTask, isPending: isUpdatePending } = useMutation({
        mutationFn: async (data: TaskSchema) => {
            const response = await api.put(`/api/update-task/${task?._id}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result;
        },
        onSuccess: () => {
            toast.success("Task updated successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-tasks", projectId],
            })
            form.reset();
            updateTaskModal.onClose()
        }
    });

    const form = useForm<TaskSchema>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            name: "",
            description: "",
            assigneeId: "",
            media: "",
            mediaType: "",
            dueDate: dayjs().add(1, "day").toDate(),
            priority: TaskPriority.LOW,
            status: initialStatus || TaskStatus.TODO,
            projectId: projectId,
            workspaceId: workspaceId
        }
    });

    const onSubmit = (data: TaskSchema) => {
        if (mode === "create") {
            createTask(data);
        } else {
            updateTask(data);
        }
    }
    
    
    useEffect(() => {
        if (task && !isLoading) {
            form.setValue("name", task?.name);
            form.setValue("description", task?.description);
            form.setValue("assigneeId", task?.assignee?._id);
            form.setValue("dueDate", dayjs(task?.dueDate).toDate());
            form.setValue("priority", task?.priority);
            form.setValue("status", task?.status);
            form.setValue("projectId", task?.project._id);
            form.setValue("media", task.media!);
            form.setValue("mediaType", task.mediaType!);
        }
    }, [task, isLoading])



    return (

        <Form {...form}>

            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-6'>
                <pre>
                    {JSON.stringify(form.formState.errors, null, 2)}
                </pre>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormDescription>
                                Give your task a name
                            </FormDescription>
                            <FormControl>
                                <Input placeholder="Task name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormDescription>
                                Give your task a short description
                            </FormDescription>
                            <FormControl>
                                <Textarea className='resize-none' rows={5} placeholder="Task Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assignee</FormLabel>
                            <FormDescription>
                                Assign a member to this task
                            </FormDescription>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select Assignee" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {members?.map((member: IMember) => (
                                            <SelectItem key={member._id} value={member._id}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className='w-4 h-4'>
                                                        <AvatarImage src={member.account.imageUrl} alt={member.account.firstName} />
                                                        <AvatarFallback>{member.account.firstName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    {member.account.firstName} {member.account.lastName}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="mediaType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Media Type</FormLabel>
                            <FormDescription>
                                Select media type
                            </FormDescription>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select Media Type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value={MediaType.IMAGE}>Image</SelectItem>
                                        <SelectItem value={MediaType.VIDEO}>Video</SelectItem>
                                        <SelectItem value={MediaType.DOCUMENT}>Document</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    form.watch("mediaType") === MediaType.IMAGE && (
                        <FormField
                            control={form.control}
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <FormDescription>
                                        Image of your task
                                    </FormDescription>
                                    <FormControl>
                                        <ImageInput value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }

                {
                    form.watch("mediaType") === MediaType.DOCUMENT && (
                        <FormField
                            control={form.control}
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Document</FormLabel>
                                    <FormDescription>
                                        Document google document url of your task
                                    </FormDescription>
                                    <FormControl>
                                        <Input placeholder='Document url' {...field} type='url' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                {
                    form.watch("mediaType") === MediaType.VIDEO && (
                        <FormField
                            control={form.control}
                            name="media"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video</FormLabel>
                                    <FormDescription>
                                        Video of your task
                                    </FormDescription>
                                    <FormControl>
                                        <VideoInput value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormDescription>
                                Select a due date for your task
                            </FormDescription>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Priority
                            </FormLabel>
                            <FormDescription>
                                Pick a priority for your task (Low, Medium, High)
                            </FormDescription>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select Assignee" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                                        <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Status
                            </FormLabel>
                            <FormDescription>
                                Pick a status for your task By default it will be todo
                            </FormDescription>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                                        <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={isCreatePending || isUpdatePending} variant={"success"}>
                    {(isCreatePending || isUpdatePending) && <Loader2 className='mr-2 animate-spin' />}
                    {mode === "create" ? "Create Task" : "Update Task"}
                </Button>
            </form>
        </Form>
    )
}

export default TaskForm