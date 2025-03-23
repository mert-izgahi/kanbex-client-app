"use client"

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/axios';
import { NotificationType } from '@/lib/enums';
import { INotification, IAccount, IWorkspace } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react'
import { TbBell, TbHourglassEmpty, TbWindmill, TbDots, TbUserPlus, TbMessage } from "react-icons/tb";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

dayjs.extend(relativeTime);


function NotificationItem({ notification, accessToken, workspace }: { notification: INotification, accessToken?: string, workspace: IWorkspace }) {
  if (!accessToken) return null;
  const Icon = useMemo(() => {
    switch (notification.type) {
      case NotificationType.WORKSPACE:
        return TbWindmill
      case NotificationType.ASSIGNMENT:
        return TbBell
      case NotificationType.INVITE:
        return TbUserPlus
      case NotificationType.MESSAGE:
        return TbBell
      case NotificationType.COMMENT:
        return TbMessage
      default:
        return TbWindmill
    }
  }, [notification.type]);

  const relatedItemPath = useMemo(() => {
    const metadata = notification.metadata as { relatedItemId?: string }
    if (notification.type === NotificationType.WORKSPACE) {
      return `/workspaces/${metadata.relatedItemId}`
    }
    if (notification.type === NotificationType.ASSIGNMENT) {
      return ""
    }
    if (notification.type === NotificationType.INVITE) {
      return `/workspaces/${workspace._id}/invites/${metadata.relatedItemId}`
    }
    if (notification.type === NotificationType.MESSAGE) {
      return ""
    }
    if (notification.type === NotificationType.COMMENT) {
      return `/workspaces/${workspace._id}/tasks/${metadata.relatedItemId}`
    }
    return null
  }, [notification.metadata]);
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: async () => {
      await api.put(`/api/read-notification/${notification._id}`, undefined, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      })
      toast.success("Notification marked as read")
    },
    onError: () => {
      toast.error("Something went wrong")
    }
  })

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between items-center'>
        <div className="flex flex-row items-center gap-2">
          {
            <Icon className='text-muted-foreground' />
          }
          <span className='text-xs'>{notification.message}</span>
          <span className='text-xs text-muted-foreground'>{dayjs(notification.createdAt).fromNow()}</span>
          {
            !notification.read && <Badge className='ms-2 rounded-sm'>New</Badge>
          }
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"}>
                <TbDots />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                relatedItemPath && (
                  <DropdownMenuItem className='cursor-pointer' onClick={async () => {
                    await mutate();
                  }}>
                    <Link href={relatedItemPath}>View</Link>
                  </DropdownMenuItem>
                )
              }

              <DropdownMenuItem className='cursor-pointer' onClick={() => mutate()}>
                Mark as read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </div>
  )
}
interface NotificationListProps {
  workspace: IWorkspace
}
function NotificationList({ workspace }: NotificationListProps) {
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


  const isEmpty = useMemo(() => {
    return notifications?.length === 0
  }, [notifications])

  if (isLoading) return <div className='flex flex-col gap-4'>
    {new Array(5).fill(0).map((_, index) => (
      <Skeleton key={index} className="h-8 w-full" />
    ))}
  </div>

  if (isEmpty) return (
    <div className='flex flex-col gap-4 h-40 justify-center items-center'>
      <TbBell className='text-muted-foreground' />
      <p className='text-muted-foreground text-sm'>You have no notifications</p>
    </div>
  )

  return (
    <div className='flex flex-col gap-4'>
      {notifications?.map((notification: INotification) => (
        <NotificationItem key={notification._id} notification={notification} workspace={workspace} accessToken={accessToken} />
      ))}
    </div>
  )
}

export default NotificationList