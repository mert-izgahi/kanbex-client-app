import React, { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { IAccount, IComment } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TbTrack, TbTrash } from 'react-icons/tb'
import { Loader2 } from 'lucide-react'
import { MediaType } from '@/lib/enums'
import { AspectRatio } from '@/components/ui/aspect-ratio'
dayjs.extend(relativeTime)
interface Props {
    comment: IComment
}
function CommentCard({ comment }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null
    const queryClient = useQueryClient();

    // delete comment
    const { mutateAsync: deleteComment, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            return api.delete(`/api/delete-comment/${comment._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        },
        onSuccess: () => {
            toast.success('Comment deleted successfully');
            queryClient.invalidateQueries({
                queryKey: ['get-comments', comment.task._id],
            });
        },
    })

    const isCreator = useMemo(() => {
        return comment.account._id === user._id
    }, [comment.account._id, user._id])
    return (
        <div className='flex flex-col gap-3 p-3 border border-border rounded-sm'>
            {/* Commentheader */}
            <div className='flex items-center gap-2'>
                <Avatar>
                    <AvatarImage src={comment?.account?.imageUrl} />
                    <AvatarFallback>{comment?.account?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className='font-bold text-sm'>{comment?.account?.firstName} {comment?.account?.lastName}</p>
                    <p className='text-xs text-muted-foreground'>{dayjs(comment.createdAt).fromNow()}</p>
                </div>
                <div className="ms-auto">
                    {
                        isCreator && <Button type='button' onClick={() => deleteComment()} disabled={isDeleting} variant='ghost'>
                            {isDeleting ? <Loader2 className='animate-spin' /> : <TbTrash className='w-4 h-4' />}
                        </Button>
                    }
                </div>
            </div>

            {/* CommentContent */}
            {
                comment.media && (
                    <AspectRatio ratio={1} className='h-32'>
                        <img src={comment.media} alt={comment.content} />
                    </AspectRatio>
                )
            }

            <p className='text-sm'>{comment.content}</p>
        </div>
    )
}

export default CommentCard