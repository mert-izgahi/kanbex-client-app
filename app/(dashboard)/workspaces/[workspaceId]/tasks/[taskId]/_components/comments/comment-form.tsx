"use client";

import React from 'react'
import { commentSchema, CommentSchema } from '@/lib/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TbSend } from 'react-icons/tb';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { IAccount, ITask } from '@/lib/types';
import { MediaType } from '@/lib/enums';
import CommentImageInput from './comment-image-input';

interface CommentFormProps {
    task: ITask

}
function CommentForm({ task }: CommentFormProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null
    if (!task) return null
    const queryClient = useQueryClient();



    const { mutate: createComment, isPending } = useMutation({
        mutationFn: async (data: CommentSchema) => {
            const response = await api.post(`/api/create-comment`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result
        },
        onSuccess: () => {
            toast.success("Comment created successfully");
            queryClient.invalidateQueries({
                queryKey: ["get-comments", task._id],
            })
            toast.success("Comment created successfully");
            form.reset();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.result_message?.message as string || error?.message || "Something went wrong";
            toast.error("Error", { description: errorMessage });
        }
    })

    const form = useForm<CommentSchema>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: "",
            media: "",
            mediaType: MediaType.IMAGE,
            taskId: task._id,
            workspaceId: task.workspace._id,
            projectId: task.project._id
        }
    })

    const onSubmit = async (data: CommentSchema) => {
        await createComment(data);
    }
    console.log(task);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row items-center gap-2 w-full">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormControl className='w-full'>
                                <Input {...field} placeholder="Write a comment" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <CommentImageInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    <TbSend size={20} />
                </Button>
            </form>
        </Form>
    )
}

export default CommentForm