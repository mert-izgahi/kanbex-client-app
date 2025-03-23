"use client";
import { IAccount, IWorkspace } from '@/lib/types'
import React from 'react';
import { CreateInviteSchema, createInviteSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Role } from '@/lib/enums';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SearchAccountsInput from '@/app/(dashboard)/workspaces/[workspaceId]/members/_components/search-accounts-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    workspace: IWorkspace,
}
function SendInviteForm({ workspace }: Props) {
    if (!workspace) return null;
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;

    const form = useForm<CreateInviteSchema>({
        resolver: zodResolver(createInviteSchema),
        defaultValues: {
            email: "",
            role: Role.MEMBER,
            projectId: "",
            workspaceId: workspace._id,

        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ["createInvite"],
        mutationFn: async (data: CreateInviteSchema) => {
            const response = await api.post(`/api/create-invite`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        onSuccess: () => {
            toast.success("Invite sent successfully");
            form.reset();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.result_message?.message as string || error?.message || "Something went wrong";
            toast.error("Error", { description: errorMessage });
        }
    })

    const onSubmit = async (data: CreateInviteSchema) => {
        await mutate(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col space-y-6'
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <SearchAccountsInput workspace={workspace} value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <FormControl className='w-full'>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {workspace.projects.map((project) => (
                                            <SelectItem key={project._id} value={project._id}>{project.name}</SelectItem>
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
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl className='w-full'>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                                        <SelectItem value={Role.MEMBER}>Member</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" variant={"success"} disabled={isPending}>
                    {isPending && <Loader2 className='mr-2 animate-spin h-4 w-4' />}
                    Send Invite
                </Button>
            </form>
        </Form>
    )
}

export default SendInviteForm