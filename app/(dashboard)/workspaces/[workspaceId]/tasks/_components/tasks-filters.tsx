"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { TbSearch } from 'react-icons/tb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskPriority, TaskStatus } from '@/lib/enums';
import DatePicker from '@/components/shared/date-picker';
import dayjs from 'dayjs';
interface Props {
    workspaceId: string
}

function TasksFilters({ workspaceId }: Props) {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialSearch = searchParams.get("search") || undefined;
    const initialStatus = searchParams.get("status") || undefined;
    const initialPriority = searchParams.get("priority") || undefined;
    const initialDueDate = searchParams.get("dueDate") || undefined;
    const [search, setSearch] = useState<string | undefined>(initialSearch);
    const [status, setStatus] = useState<string | undefined>(initialStatus);
    const [priority, setPriority] = useState<string | undefined>(initialPriority);
    const [dueDate, setDueDate] = useState<string | undefined>(initialDueDate);
    const handleSearchChange = (newSearch: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!newSearch) {
            params.delete("search");
        } else {
            params.set("search", newSearch);
        }
        setSearch(newSearch);
        router.push(`/workspaces/${workspaceId}/tasks?${params.toString()}`);
    }

    const handleStatusChange = (newStatus: string) => {
        const updatedStatus = newStatus === "all" ? undefined : newStatus;
        const params = new URLSearchParams(searchParams.toString());

        if (!updatedStatus) {
            params.delete("status");
        } else {
            params.set("status", updatedStatus);
        }

        setStatus(updatedStatus);
        router.push(`/workspaces/${workspaceId}/tasks?${params.toString()}`);

    };
    const handlePriorityChange = (newPriority: string) => {
        const updatedPriority = newPriority === "all" ? undefined : newPriority;
        const params = new URLSearchParams(searchParams.toString());

        if (!updatedPriority) {
            params.delete("priority");
        } else {
            params.set("priority", updatedPriority);
        }

        setPriority(updatedPriority);
        router.push(`/workspaces/${workspaceId}/tasks?${params.toString()}`);
    }

    const handleDueDateChange = (newDueDate: string) => {
        const updatedDueDate = newDueDate === "all" ? undefined : newDueDate;
        const params = new URLSearchParams(searchParams.toString());

        if (!updatedDueDate) {
            params.delete("dueDate");
        } else {
            params.set("dueDate", dayjs(updatedDueDate).format("YYYY-MM-DD"));
        }

        setDueDate(updatedDueDate);
        router.push(`/workspaces/${workspaceId}/tasks?${params.toString()}`);
    }
    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["my-tasks", workspaceId, search],
        });
    }, [queryClient, workspaceId, search]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["my-tasks", workspaceId, status],
        });
    }, [queryClient, workspaceId, status]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["my-tasks", workspaceId, priority],
        });
    }, [queryClient, workspaceId, priority]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["my-tasks", workspaceId, dueDate],
        });
    }, [queryClient, workspaceId, dueDate]);

    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className="flex flex-col gap-2">
                <Label htmlFor="search">Search</Label>
                <div className='relative h-9'>
                    <Input value={search ? search : ""} onChange={(e) => setSearch(e.target.value)} className='h-full' />
                    <Button size={"icon"} variant={"ghost"} className='absolute right-1 top-1/2 -translate-y-1/2' onClick={() => handleSearchChange(search!)}>
                        <TbSearch />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All</SelectItem>
                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex flex-col gap-2'>
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker
                    value={dayjs(dueDate!).toDate()}
                    onChange={(value) => handleDueDateChange(dayjs(value).format("YYYY-MM-DD"))}
                />
            </div>
        </div>
    )
}

export default TasksFilters