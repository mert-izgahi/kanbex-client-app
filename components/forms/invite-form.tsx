"use client";

import React from 'react'
import { AcceptWorkspaceInviteSchema, acceptWorkspaceInviteSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { IAccount, IInvite } from '@/lib/types';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { InviteStatus } from '@/lib/enums';
interface Props {
    inviteId: string
    workspaceId: string
}

function InviteForm({ inviteId, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;

    const { data: invite, isLoading, error } = useQuery<IInvite>({
        queryKey: ["invite", inviteId],
        queryFn: async () => {
            const response = await api.get(`/api/get-invite/${inviteId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken,
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ["acceptWorkspaceInvite", inviteId],
        mutationFn: async (data: AcceptWorkspaceInviteSchema) => {
            const response = await api.post(`/api/accept-invite/${inviteId}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        onSuccess: () => {
            toast.success("Workspace joined successfully, you will be redirected to the workspace page");
            window.location.assign(`/workspaces/${invite?.workspace?._id}`);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.result_message?.message as string || error?.message || "Something went wrong";
            toast.error("Error", { description: errorMessage });
        }
    })


    const form = useForm<AcceptWorkspaceInviteSchema>({
        resolver: zodResolver(acceptWorkspaceInviteSchema),
        defaultValues: {
            inviteCode: "",
        }
    })
    const onSubmit = async (data: AcceptWorkspaceInviteSchema) => {
        await mutate(data);
    }


    if (isLoading) {
        return <div className='flex items-center justify-center h-40'>
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    }

    if (error) {
        return <div className='flex items-center justify-center h-40'>
            <p className='text-sm'>Error loading invite - Invite Id {inviteId}</p>
        </div>
    }

    if(invite?.status === InviteStatus.EXPIRED) {
        return <div className='flex items-center justify-center h-40'>
            <p className='text-sm'>Invite has expired</p>
        </div>
    }

    if(invite?.status === InviteStatus.ACCEPTED) {
        window.location.assign(`/workspaces/${invite?.workspace?._id}`);
        return null
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-2xl mx-auto flex flex-col gap-4'>
                <div>
                    <h1 className='text-xl font-semibold'>Join Workspace</h1>
                    <p className='text-muted-foreground text-sm'>
                        {invite?.account?.firstName} {invite?.account?.lastName} has invited you to join {invite?.workspace?.name}
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="inviteCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workspace Invite Code</FormLabel>
                            <FormDescription>
                                Enter the invite code to join the workspace
                            </FormDescription>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-row items-center justify-end gap-2">
                    <Button asChild variant={"ghost"}>
                        <Link href={`/workspaces`} >Cancel</Link>
                    </Button>
                    <Button type="submit" variant={"success"}>
                        {form.formState.isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Join Workspace
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default InviteForm