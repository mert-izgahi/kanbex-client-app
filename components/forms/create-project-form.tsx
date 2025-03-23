"use client"
import React from 'react'
import { IAccount, IWorkspace } from '@/lib/types'
import { ProjectSchema, projectSchema } from '@/lib/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTaskTabs } from '@/hooks/use-task-tabs'
import { useProjectModal } from '@/hooks/use-modals'

export function CreateProjectForm({ workspace }: { workspace: IWorkspace }) {
    const session = useSession()
    const taskTabs = useTaskTabs();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const projectModal = useProjectModal();
    const queryClient = useQueryClient()
    const { mutate: createProject, isPending } = useMutation({
        mutationFn: async (data: ProjectSchema) => {
            const response = await api.post("/api/create-project", data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result
        },
        onSuccess: (data) => {
            toast.success("Project created successfully", {
                description: "You will be redirected to the project page"
            })
            queryClient.invalidateQueries({
                queryKey: ["projects", workspace._id]
            });
            projectModal.onClose();
            taskTabs.setActiveTab("list");
            window.location.assign(`/workspaces/${workspace._id}/projects/${data._id}`);
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error?.message || "Something went wrong";
            toast.error("Error", { description: errorMessage });
        }
    })

    const form = useForm<ProjectSchema>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            workspaceId: workspace._id
        }
    })

    const onSubmit = async (data: ProjectSchema) => {
        await createProject(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormDescription>What is your project name?</FormDescription>
                            <FormControl>
                                <Input placeholder="Project Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex flex-row justify-end">
                    <Button type="submit" disabled={isPending} variant={"success"}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    )
}