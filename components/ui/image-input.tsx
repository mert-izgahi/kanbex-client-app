"use client"

import React, { useRef } from 'react'
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { TbCamera } from "react-icons/tb";
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

function ImageInput({ value, onChange }: Props) {
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
        onError: (error:any) => {
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
            <Avatar className='w-16 h-16 rounded-sm'>
                <AvatarImage src={value ? value : undefined} className='rounded-sm object-cover' />
                <AvatarFallback className='rounded-sm'>
                    <TbCamera className='w-6 h-6' />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                    <Button type='button' variant={"secondary"} onClick={() => inputRef.current?.click()} className='text-sm'>
                        {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                        Upload Image
                    </Button>

                    {
                        value && <Button type='button' variant={"ghost"} onClick={() => onChange?.("")} className='text-sm'>
                            Remove
                        </Button>
                    }
                </div>
                <p className="text-xs text-muted-foreground">
                    Allowed JPG, JPEG, PNG, GIF or WebM. Max size of 5MB.
                </p>
            </div>
        </div>
    )
}

export default ImageInput