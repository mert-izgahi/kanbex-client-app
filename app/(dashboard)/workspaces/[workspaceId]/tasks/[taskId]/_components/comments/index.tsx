import React from 'react'
import CommentForm from './comment-form'
import CommentsList from './comments-list'
import { ITask } from '@/lib/types'
import MembersGroup from '@/components/ui/members-group'

interface CommentsProps {
    task: ITask
}
function Comments({ task }: CommentsProps) {
    return (
        <div className='flex flex-col gap-y-6 w-full h-full'>
            <div className="flex h-20 items-center px-6 py-6">
                <h4 className='text-lg font-semibold'>Comments {0}</h4>
                <MembersGroup members={task.project.projectMembers} />
            </div>
            <div className="flex flex-col gap-4 flex-1 overflow-y-scroll px-6">
                <CommentsList task={task} />
            </div>
            <div className='flex flex-row items-center h-40  py-4 px-6'>
                <CommentForm task={task} />
            </div>
        </div>
    )
}

export default Comments