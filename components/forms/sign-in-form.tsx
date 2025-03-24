"use client";
import React from 'react'
import { signInSchema, SignInSchema } from '@/lib/zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { DEFAULT_REDIRECT, signIn as signInNext } from '@/lib/auth';
import { signInAction } from '@/actions/auth';


function SignInForm() {
  const searchParams = new URLSearchParams(window.location.search);
  const callbackUrl = searchParams.get("callbackUrl");

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (args: SignInSchema) => {
      await signInAction(args);
      window.location.assign(process.env.NEXT_PUBLIC_RIDRECT_AUTH_URL!);
    },
    onSuccess: (data) => {
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

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInSchema) => {
    await mutate(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
        <Button type='submit' variant={"success"}>
          {isPending && <Loader2 className='animate-spin mr-2' />}
          Sign In
        </Button>
      </form>
    </Form>
  )
}

export default SignInForm