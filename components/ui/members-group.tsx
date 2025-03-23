"use client"

import { IMember } from '@/lib/types'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

interface MembersGroupProps {
    members: IMember[]
}

export function MemberGroupItem({ member }: { member: IMember }) {
    return (
        <div className='flex flex-row items-center gap-2 bg-muted py-1.5 px-4 rounded-sm max-w-32'>
            <Avatar className='w-6 h-6'>
                <AvatarImage src={member?.account?.imageUrl} />
                <AvatarFallback>{member?.account?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className='text-xs'>{member?.account?.firstName} {member?.account?.lastName}</span>
            </div>
        </div>
    )
}

function MembersGroup({ members }: MembersGroupProps) {
    return (
        <div className="flex flex-row items-center gap-2 flex-wrap">
            {
                members?.slice(0, 5).map((member: IMember) => {
                    return (
                        <Tooltip key={member?._id}>
                            <TooltipTrigger>
                                <MemberGroupItem member={member} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>{member?.role}</span>
                            </TooltipContent>
                        </Tooltip>
                    )
                })
            }
            {
                members?.length > 5 &&
                <Tooltip>
                    <TooltipTrigger>
                        <Button variant="ghost" className="w-10 h-10 rounded-full">
                            +{members?.length - 5}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>View all members</span>
                    </TooltipContent>
                </Tooltip>
            }
        </div>
    )
}

export default MembersGroup