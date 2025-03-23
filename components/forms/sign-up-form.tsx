"use client";
import React from 'react'
import { signUpSchema, SignUpSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DEFAULT_REDIRECT } from '@/lib/auth';


function SignUpForm() {
    const searchParams = new URLSearchParams(window.location.search);
    const callbackUrl = searchParams.get("callbackUrl");
    const { mutate, isPending } = useMutation({
        mutationKey: ["sign-in"],
        mutationFn: async (args: SignUpSchema) => {
            await api.post("/api/sign-up", args);
        },
        onSuccess: () => {
            toast.success("Sign in successfully");
            if (callbackUrl) {
                window.location.assign(callbackUrl);
            } else {
                window.location.assign(DEFAULT_REDIRECT);
            }
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.result_message?.message || error?.message || "Sign in failed";
            toast.error(errorMessage);
        }
    })
    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: SignUpSchema) => {
        await mutate(data);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormDescription>
                                We will never share your email with anyone.
                            </FormDescription>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormDescription>
                                Password must be at least 8 characters.
                            </FormDescription>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={isPending} className='w-full' variant={"netural"}>
                    {isPending && <Loader2 className='animate-spin' />}
                    Create an account
                </Button>
            </form>
        </Form>
    )
}

export default SignUpForm