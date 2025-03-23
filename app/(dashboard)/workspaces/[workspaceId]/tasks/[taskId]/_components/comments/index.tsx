import React from 'react'
import CommentForm from './comment-form'
import CommentsList from './comments-list'
import { ITask } from '@/lib/types'

interface CommentsProps {
    task: ITask
}
function Comments({ task }: CommentsProps) {
    return (
        <div className='flex flex-col gap-6 w-full h-full'>
            <div className="flex h-12 items-center">
                <h4 className='text-lg font-semibold'>Comments {0}</h4>
            </div>
            <div className="flex flex-col gap-4 flex-1 overflow-y-scroll">
                <CommentsList task={task} />
            </div>
            <div className='flex flex-row items-center h-12'>
                <CommentForm task={task} />
            </div>
        </div>
    )
}

export default Comments