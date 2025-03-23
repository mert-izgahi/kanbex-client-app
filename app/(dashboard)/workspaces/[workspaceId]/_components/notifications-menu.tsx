"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { INotification, IAccount, IWorkspace } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React from 'react'
import { TbBell, TbHourglassEmpty, TbWindmill, TbUserPlus } from "react-icons/tb";
import { api } from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationType } from '@/lib/enums';
import Link from 'next/link';

interface NotificationItemProps {
    workspace: IWorkspace;
}


function NotificationsMenu({ workspace }: NotificationItemProps) {
    if(!workspace) return null;
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null


    const { data: notifications, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await api.get("/api/get-notifications", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken
    })

    const hasNotifications = notifications?.length > 0 && notifications?.some((notification: INotification) => !notification.read);
    const hasNewNotifications = notifications?.some((notification: INotification) => !notification.read);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className='relative'>
                    {
                        hasNotifications && <AnimatePresence>
                            {hasNotifications && hasNewNotifications && (
                                <motion.span
                                    className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-success"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.3, 1] }} // Pulse animation
                                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                />
                            )}
                        </AnimatePresence>
                    }
                    <TbBell />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='w-80 rounded-sm' align="end" >
                <DropdownMenuLabel className='flex items-center justify-between'>
                    <span className='font-semibold text-xs'>Notifications</span>
                    <Button variant={"link"} size={"sm"} asChild className='h-6 text-xs'>
                        <Link href={`/workspaces/${workspace?._id}/notifications`}>View all</Link>
                    </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                    hasNotifications && notifications?.filter((notification: INotification) => !notification.read).map((notification: INotification) => (
                        <DropdownMenuItem key={notification._id}>
                            <div>
                                {
                                    notification.type === NotificationType.WORKSPACE && (
                                        <div className='flex items-center gap-2'>
                                            <TbWindmill />
                                            <span>{notification.message}</span>
                                        </div>
                                    )
                                }

                                {
                                    notification.type === NotificationType.INVITE && (
                                        <div className='flex items-center gap-2'>
                                            <TbUserPlus />
                                            <span>{notification.message}</span>
                                        </div>
                                    )
                                }
                            </div>
                        </DropdownMenuItem>
                    ))
                }

                {
                    !hasNotifications && (
                        <DropdownMenuItem className='h-40 flex items-center justify-center'>
                            <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                                <TbHourglassEmpty className='text-muted-foreground' />
                                <span className='text-muted-foreground'>No notifications</span>
                            </div>
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NotificationsMenu