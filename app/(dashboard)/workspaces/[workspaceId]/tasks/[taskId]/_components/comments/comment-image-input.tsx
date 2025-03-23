"use client"

import React, { useRef } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TbCamera, TbTrash } from "react-icons/tb";
import { useSession } from 'next-auth/react';
import { IAccount } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';

interface Props {
    value?: string
    onChange?: (value: string) => void
}

function CommentImageInput({ value, onChange }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;


    const { mutate, isPending } = useMutation({
        mutationKey: ["uploadImage"],
        mutationFn: async (args: FormData) => {
            const response = await api.post("/api/upload-image", args,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            const { result } = await response.data;
            return result
        },
        onSuccess: (data) => {
            onChange?.(data.url);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.error || error?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    })

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            await mutate(formData);
        }
    }

    return (
        <div className='flex items-center gap-4'>
            <input hidden ref={inputRef} type="file" onChange={handleChange} accept='image/*' />
            <div className="flex flex-row items-center gap-2">
                {
                    value && <Avatar className='rounded-sm'>
                        <AvatarImage src={value} />
                        <AvatarFallback>
                            N
                        </AvatarFallback>
                    </Avatar>
                }
                <div className="flex flex-row gap-2">
                    <Button type='button' variant={"secondary"} onClick={() => inputRef.current?.click()} size={"icon"} className='text-sm'>
                        {isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <TbCamera className='w-4 h-4' />}
                    </Button>

                    {
                        value && <Button type='button' variant={"ghost"} onClick={() => onChange?.("")} className='text-sm'>
                            <TbTrash className='w-4 h-4' />
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default CommentImageInput