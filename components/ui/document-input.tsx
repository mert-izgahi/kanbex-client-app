"use client";

import React, { useRef } from 'react';
import { Button } from './button';
import { TbFile, TbTrash, TbFileCheck, TbDownload } from 'react-icons/tb';
import { useSession } from 'next-auth/react';
import { IAccount } from '@/lib/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/axios';
import Link from 'next/link';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    label?: string; // Optional label for the button
}

function DocumentInput({ value, onChange, label = "Upload Document" }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;

    const { mutate, isPending } = useMutation({
        mutationKey: ["uploadDocument"],
        mutationFn: async (args: FormData) => {
            const response = await api.post("/api/upload-document", args, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            const { result } = await response.data;
            return result;
        },
        onSuccess: (data) => {
            onChange?.(data.url);
        },
        onError: (error) => {
            toast.error("Something went wrong");
        },
    });



    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("document", file);
            await mutate(formData);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <input hidden ref={inputRef} type="file" onChange={handleChange} />
            <div className="flex items-center justify-center w-16 h-16 rounded-sm border border-border">
                {
                    value ? (
                        <TbFileCheck className="w-6 h-6 text-muted-foreground" />
                    ) : (
                        <TbFile className="w-6 h-6 text-muted-foreground" />
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                    <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() => inputRef.current?.click()}
                        className="text-sm"
                    >
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {label}
                    </Button>

                    {value && (
                        <div className='flex items-center gap-2'>
                            <Button
                                type="button"
                                variant={"ghost"}
                                size={"icon"}
                                onClick={() => onChange?.("")}
                                className="text-sm"
                            >
                                <TbTrash className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    Allowed PDF, DOC, DOCX, TXT. Max size of 10MB.
                </p>
            </div>
        </div>
    );
}

export default DocumentInput;