"use client";
import React, { useCallback, useState } from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '../../../../../../components/ui/input'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { IAccount, IWorkspace } from '@/lib/types';
import { api } from '@/lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../../../components/ui/avatar';

interface Props {
    workspace: IWorkspace
    value?: string
    onChange?: (value: string) => void
}
function SearchAccountsInput({ workspace, value, onChange }: Props) {
    if (!workspace) return null


    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;
    const { data: results, isLoading } = useQuery<IAccount[]>({
        queryKey: ["searchAccounts", value],
        queryFn: async () => {
            const response = await api.get(`/api/search-accounts-by-email/${workspace._id}?search=${value}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const { result } = await response.data;
            return result;
        },
        enabled: !!accessToken || !!value
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Input placeholder="Search accounts..." value={value} readOnly className='text-start h-9' />
            </PopoverTrigger>

            <PopoverContent className='w-[460px]'>
                <Command>
                    <CommandInput placeholder="Search accounts..." value={value} onValueChange={(e) => onChange?.(e)} />
                    <CommandList>
                        <CommandEmpty>
                            {
                                isLoading && value ? (
                                    <div className='flex items-center justify-center h-40 gap-2'>
                                        <Loader2 className='animate-spin' />
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center h-40 gap-2'>
                                        <span>No results found.</span>
                                    </div>
                                )
                            }
                        </CommandEmpty>
                        <CommandGroup>
                            {results?.map((result: IAccount) => (
                                <CommandItem
                                    key={result._id}
                                    value={result.email}
                                    onSelect={() => {
                                        onChange?.(result.email);
                                    }}
                                    className='cursor-pointer'
                                >
                                    <div className='flex items-center gap-3'>
                                        <Avatar>
                                            <AvatarImage src={result.imageUrl} />
                                            <AvatarFallback>{result.imageUrl}</AvatarFallback>
                                        </Avatar>
                                        <span>{result.email}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default SearchAccountsInput