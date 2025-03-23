import ErrorState from '@/components/shared/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { IMember, ITask } from '@/lib/types'
import React, { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, getDay, parse, startOfWeek, addMonths, subMonths } from "date-fns";
import dayjs from 'dayjs'
import "react-big-calendar/lib/css/react-big-calendar.css";
import Link from 'next/link'
import { TaskPriority, TaskStatus } from '@/lib/enums'
import { TaskStatusBadge } from '@/components/shared/task-badges'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { TbArrowLeft, TbArrowRight, TbCalendar } from 'react-icons/tb'

const locales = {
    "en-US": require("date-fns/locale/en-US"),
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    datesInRange: (start: Date, end: Date) => {
        const result = [];
        let currentDate = start;
        while (currentDate <= end) {
            result.push(currentDate);
            currentDate = addMonths(currentDate, 1);
        }
        return result;
    },
    addMonths,
    subMonths,
    locales,
});


interface EventComponentProps {
    name: string
    start: Date
    end: Date
    id: string
    workspaceId: string
    assignee: IMember
    status: TaskStatus
    priority: TaskPriority
    projectId: string
}

function EventCard({ id, name, start, end, workspaceId, assignee, status, priority, projectId }: EventComponentProps) {
    return (
        <Link href={`/workspaces/${workspaceId}/tasks/${id}`} className='flex flex-col gap-2 h-full bg-foreground text-background rounded-md p-2'>
            <div className="flex items-center gap-1">
                <Avatar>
                    <AvatarImage src={assignee.account.imageUrl} />
                    <AvatarFallback>{assignee.account.firstName[0]}</AvatarFallback>
                </Avatar>
                <p className='text-xs font-semibold'>{assignee.account.firstName} {assignee.account.lastName}</p>
            </div>
            <div className='flex items-center justify-between'>

                <p className='text-xs font-semibold'>{name}</p>
                <TaskStatusBadge status={status} />

            </div>
        </Link>
    )
}

interface Props {
    tasks?: ITask[],
    isLoading?: boolean
    error?: any
    projectId?: string
    workspaceId: string
}
function TasksCalenderView({ tasks, isLoading, error, projectId, workspaceId }: Props) {
    const [value, setValue] = useState(
        tasks && tasks.length > 0 ? dayjs(tasks[0].dueDate).toDate() : new Date()
    );

    const events = tasks?.map((task) => ({
        start: dayjs(task.dueDate).toDate(),
        end: dayjs(task.dueDate).toDate(),
        title: task.name,
        workspaceId: workspaceId,
        projectId: projectId,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        id: task._id
    }))


    const handleNavigate = (action: "NEXT" | "PREV" | "TODAY") => {
        if (action === "NEXT") {
            setValue(addMonths(value, 1));
        } else if (action === "PREV") {
            setValue(subMonths(value, 1));
        } else {
            setValue(new Date());
        }
    }

    if (error) {
        return <ErrorState error={error} />
    }

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
        <div>
            <Calendar
                localizer={localizer}
                date={value}
                events={events}
                views={['month']}
                defaultView='month'
                toolbar
                showAllEvents
                className='h-full'
                max={dayjs().add(12, 'month').toDate()}
                min={dayjs().subtract(3, 'month').toDate()}
                formats={{
                    weekdayFormat: (date: Date, culture, localizer) => {
                        return dayjs(date).format('ddd')
                    },
                }}
                components={{
                    eventWrapper: ({ event }) => {
                        return (
                            <div className='p-1'>
                                <EventCard name={event.title} start={event.start} end={event.end} id={event.id} workspaceId={workspaceId}
                                    assignee={event.assignee} status={event.status as TaskStatus} priority={event.priority as TaskPriority} projectId={projectId!}
                                />
                            </div>
                        )
                    },
                    toolbar: (props) => {
                        return (
                            <div className='flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-2'>
                                    {/* <button className='text-sm font-semibold' onClick={() => handleNavigate("PREV")}>Prev</button>
                                    <button className='text-sm font-semibold' onClick={() => handleNavigate("NEXT")}>Next</button> */}
                                    <Button size='sm' variant='outline' onClick={() => handleNavigate("PREV")}>
                                        <TbArrowLeft />
                                    </Button>
                                    <Button size='sm' variant='outline' onClick={() => handleNavigate("TODAY")}>
                                        <TbCalendar />
                                        {dayjs().format("MMM DD, YYYY")}
                                    </Button>
                                    <Button size='sm' variant='outline' onClick={() => handleNavigate("NEXT")}>
                                        <TbArrowRight />
                                    </Button>
                                </div>
                                {/* <button className='text-sm font-semibold' onClick={() => handleNavigate("TODAY")}>Today</button> */}
                                
                            </div>
                        )
                    }
                }}
            />
            {/* {tasks && <pre>
                {JSON.stringify(tasks, null, 2)}
            </pre>} */}
        </div>
    )
}

export default TasksCalenderView