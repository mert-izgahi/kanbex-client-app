"use client";
import React from 'react'
import { api } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { IAccount, IMember, IWorkspace } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TbDots, TbTrash, TbTriangleOff } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { TbSettings2 } from "react-icons/tb";
import { Role } from '@/lib/enums';

interface Props {
    workspace: IWorkspace
}

function MemberListItem({ member, isAdmin }: { member: IMember, isAdmin: boolean }) {
    return (
        <div className='flex flex-row items-center gap-3'>
            <Avatar className='w-10 h-10'>
                <AvatarImage src={member.account.imageUrl} />
                <AvatarFallback>{member.account.firstName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2">
                <h3 className="text-md font-medium leading-none">{member.account.firstName} {member.account.lastName}</h3>
                <p className="text-sm font-medium leading-none text-muted-foreground">{member.account.email}</p>
            </div>
            <div className='ms-auto flex items-center gap-4 flex-1 justify-end'>
                <Badge className='max-w-20 w-full'>
                    {member.role}
                </Badge>
                {
                    isAdmin && <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type='button' variant='ghost' size={"icon"}>
                                <TbDots />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='w-56 rounded-sm'>
                            <DropdownMenuItem className='cursor-pointer'>
                                <TbSettings2 className='w-4 h-4 mr-2' />
                                Set Role as Manager
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <TbSettings2 className='w-4 h-4 mr-2' />
                                Set Role as Member
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <TbTriangleOff className='w-4 h-4 mr-2' />
                                Block
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <TbTrash className='w-4 h-4 mr-2' />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>
        </div>
    )
}

function MembersList({ workspace }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;

    if (!accessToken) {
        return null;
    }

    const { data: members, isLoading } = useQuery<IMember[]>({
        queryKey: ["members", workspace?._id],
        queryFn: async () => {
            const response = await api.get(`/api/get-members?workspace=${workspace._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken
    })


    if (isLoading) {
        return <div className='flex flex-col gap-4'>
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-12" />
                ))
            }
        </div>
    }

    return (
        <div className='flex flex-col gap-8'>
            {
                members?.map((member, index) => (
                    <MemberListItem key={index} member={member} isAdmin={workspace.currentAccountPermission === Role.ADMIN} />
                ))
            }
        </div>
    )
}

export default MembersList