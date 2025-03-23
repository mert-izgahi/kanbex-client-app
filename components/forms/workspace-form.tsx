"use client"

import { IAccount, IWorkspace } from '@/lib/types'
import React, { useEffect } from 'react'
import { workspaceSchema, WorkspaceSchema } from '@/lib/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import ImageInput from '../ui/image-input'
import { Textarea } from '../ui/textarea'
interface Props {
    mode: "create" | "edit"
    workspaceId?: string
}

function WorkspaceForm({ mode, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount
    const accessToken = user?.accessToken

    if (!accessToken) {
        return null
    }
    const queryClient = useQueryClient();
    const { data: workspace, isLoading: workspaceLoading, error: workspaceError, refetch } = useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            const response = await api.get(`/api/get-workspace/${workspaceId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = response.data;
            return result
        },
        enabled: mode === "edit" && !!workspaceId
    })

    const { mutate, isPending } = useMutation({
        mutationKey: [mode === "create" ? "createWorkspace" : "updateWorkspace"],
        mutationFn: async (data: WorkspaceSchema): Promise<IWorkspace | null> => {
            if (mode === "create") {
                const response = await api.post("/api/create-workspace", data,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const { result } = response.data;
                return result
            }

            if (mode === "edit") {
                const response = await api.put(`/api/update-workspace/${workspaceId}`, data,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                const { result } = response.data;
                return result
            }

            return null
        },
        onSuccess: (data) => {
            if (!data) {
                toast.error("Something went wrong")
            }
            if (mode === "create") {
                toast.success("Workspace created successfully and you will be redirected to the workspace page");
                window.location.assign(`/workspaces/${data?._id}`);
            } else {
                toast.success("Workspace updated successfully");
                refetch();
            }

            queryClient.invalidateQueries({
                queryKey: ["workspaces"],
            });
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
        onError: (error) => {
            toast.error("Something went wrong")
        }
    })


    const form = useForm<WorkspaceSchema>({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: `${user?.firstName}'s Workspace`,
            description: "",
            imageUrl: "",
        },
    })

    const onSubmit = async (data: WorkspaceSchema) => {
        await mutate(data)
    }

    useEffect(() => {
        if (mode === "edit" && workspace) {
            form.setValue("name", workspace.name)
            form.setValue("description", workspace.description)
            form.setValue("imageUrl", workspace.imageUrl)
        }
    }, [workspace])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-8'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormDescription>
                                Name of the workspace you want to create
                            </FormDescription>
                            <FormControl>
                                <Input placeholder="Workspace name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormDescription>
                                Image of the workspace you want to create
                            </FormDescription>
                            <FormControl>
                                <ImageInput value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    mode === "edit" && <>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormDescription>
                                        Up to 500 characters of the workspace description
                                    </FormDescription>
                                    <FormControl>
                                        <Textarea rows={5} className='resize-none' placeholder="Workspace description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                }

                <div className="flex items-center justify-end">
                    <Button variant={'success'} type="submit" disabled={isPending}>
                        {isPending && <Loader2 className='animate-spin mr-2' />}
                        {mode === "create" ? "Create Workspace" : "Update Workspace"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default WorkspaceForm