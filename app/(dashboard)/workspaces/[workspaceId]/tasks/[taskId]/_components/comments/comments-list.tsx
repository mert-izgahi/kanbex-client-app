"use client"
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { IAccount, IComment, ITask } from '@/lib/types'
import CommentCard from './comment-card'

interface CommentsListProps {
    task: ITask
}
function CommentsList({ task }: CommentsListProps) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null
    if (!task) return null
    const scollerRef = React.useRef<HTMLDivElement>(null);
    const { data: comments, isLoading } = useQuery<IComment[]>({
        queryKey: ["get-comments", task._id],
        queryFn: async () => {
            const response = await api.get(`/api/get-comments`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    taskId: task._id
                }
            })
            const { result } = await response.data;
            return result
        }
    })

    // useEffect(() => {
    //     scollerRef.current?.scrollIntoView({ behavior: "smooth" });
    //     return () => { }
    // }, [comments]);

    if (isLoading) {
        return (
            <div className='flex flex-col gap-4'>
                {
                    new Array(5).fill(0).map((_, index) => (
                        <Skeleton key={index} className="h-12" />
                    ))
                }
            </div>
        )
    }
    if (!comments) return null;
    return (
        <div className='flex flex-col gap-4 h-full'>
            {
                comments.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full gap-4'>
                        <p className='text-sm text-muted-foreground'>No comments yet</p>
                    </div>
                ) : (
                    comments.map((comment: IComment) => (
                        <CommentCard key={comment._id} comment={comment} />
                    ))
                )
            }

            <div ref={scollerRef} />
        </div>
    )
}

export default CommentsList