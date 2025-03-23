"use client"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useId } from "react";
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/axios';
import { IAccount } from '@/lib/types';
import { cn } from '@/lib/utils';
import { projectSchema, ProjectSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProjectSettingsFormProps {
    projectId: string
}

function ProjectSettingsForm({ projectId }: ProjectSettingsFormProps) {
    const session = useSession()
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;

    const queryClient = useQueryClient();

    const { data: project, isLoading } = useQuery({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const response = await api.get(`/api/get-project/${projectId}`, {
                headers: {

                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result;
        },
        enabled: !!accessToken || !!projectId,
    });

    const { mutate: updateProject, isPending } = useMutation({
        mutationFn: async (data: ProjectSchema) => {
            const response = await api.put(`/api/update-project/${projectId}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result
        },
        onSuccess: (data) => {
            toast.success("Project updated successfully")
            queryClient.invalidateQueries({
                queryKey: ["projects", project?.workspace?._id]
            });
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
            color: "",
            description: "",
            workspaceId: project?.workspace?._id
        }
    })

    const onSubmit = (data: ProjectSchema) => {
        updateProject(data);
    }

    useEffect(() => {
        if (project) {
            form.setValue("name", project.name);
            form.setValue("description", project.description);
            form.setValue("workspaceId", project.workspace?._id);
        }
    }, [project])


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full'>
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

                

                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Primary Color</FormLabel>
                            <FormDescription>What is your primary color of your project?</FormDescription>
                            <FormControl>
                                <fieldset className="space-y-4">
                                    <legend className="text-foreground text-sm leading-none font-medium">Choose a color</legend>
                                    <RadioGroup className="flex gap-1.5" value={field.value} onValueChange={field.onChange}>
                                        <RadioGroupItem
                                            value="blue"
                                            id={useId()}
                                            aria-label="Blue"
                                            className="size-6 border-blue-500 bg-blue-500 shadow-none data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500"
                                        />
                                        <RadioGroupItem
                                            value="indigo"
                                            id={useId()}
                                            aria-label="Indigo"
                                            className="size-6 border-indigo-500 bg-indigo-500 shadow-none data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500"
                                        />
                                        <RadioGroupItem
                                            value="pink"
                                            id={useId()}
                                            aria-label="Pink"
                                            className="size-6 border-pink-500 bg-pink-500 shadow-none data-[state=checked]:border-pink-500 data-[state=checked]:bg-pink-500"
                                        />
                                        <RadioGroupItem
                                            value="red"
                                            id={useId()}
                                            aria-label="red"
                                            className="size-6 border-red-500 bg-red-500 shadow-none data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                                        />
                                        <RadioGroupItem
                                            value="orange"
                                            id={useId()}
                                            aria-label="orange"
                                            className="size-6 border-orange-500 bg-orange-500 shadow-none data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                                        />
                                        <RadioGroupItem
                                            value="amber"
                                            id={useId()}
                                            aria-label="amber"
                                            className="size-6 border-amber-500 bg-amber-500 shadow-none data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500"
                                        />
                                        <RadioGroupItem
                                            value="emerald"
                                            id={useId()}
                                            aria-label="emerald"
                                            className="size-6 border-emerald-500 bg-emerald-500 shadow-none data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500"
                                        />
                                    </RadioGroup>
                                </fieldset>
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
                            <FormLabel>Project Description</FormLabel>
                            <FormDescription>What is your project description?</FormDescription>
                            <FormControl>
                                <Textarea className='resize-none' rows={5} placeholder="Project Description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex flex-row justify-end">
                    <Button type="submit" disabled={isPending} variant={"success"}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default ProjectSettingsForm