"use client";

import React, { useMemo } from 'react'
import { signOutAction } from '@/actions/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { IAccount } from '@/lib/types';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { TbArrowLeft, TbDashboard } from "react-icons/tb"


function UserButton() {
    const session = useSession() as any;
    const isAuthenticated = session.status === "authenticated";



    const user = useMemo(() => {
        return session.data?.user as IAccount
    }, [session.data?.user]);

    console.log(user);


    const handleSignOut = async () => {
        await signOutAction();
        await api.post("/api/sign-out", undefined, {
            headers: {
                Authorization: `Bearer ${user?.accessToken}`
            }
        });
    }

    if (!isAuthenticated) {
        return null;
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer'>
                <Avatar className='w-8 h-8'>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className='w-48'>
                <DropdownMenuItem asChild>
                    <Link href="/workspaces">
                        <TbDashboard className='mr-2' />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                    <TbArrowLeft className='mr-2' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton