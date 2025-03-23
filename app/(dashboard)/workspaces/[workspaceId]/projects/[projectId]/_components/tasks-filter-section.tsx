"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { TaskPriority, TaskStatus } from '@/lib/enums';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import dayjs from 'dayjs';
import DatePicker from '@/components/shared/date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TbSearch } from 'react-icons/tb';
import { useTaskTabs } from '@/hooks/use-task-tabs';

interface Props {
    workspaceId: string
    projectId?: string

}
function TasksFilterSection({ workspaceId, projectId }: Props) {
    const router = useRouter();
    const { activeTab } = useTaskTabs();
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get("status") || undefined;
    const initialPriority = searchParams.get("priority") || undefined;
    const initialDueDate = searchParams.get("dueDate") || undefined;
    const initialSearch = searchParams.get("search") || undefined;
    
    const [status, setStatus] = useState<string | undefined>(initialStatus);
    const [priority, setPriority] = useState<string | undefined>(initialPriority);
    const [dueDate, setDueDate] = useState<string | undefined>(initialDueDate);
    const [search, setSearch] = useState<string | undefined>(initialSearch);

    const queryClient = useQueryClient();

    const handleStatusChange = (newStatus: string) => {
        const updatedStatus = newStatus === "all" ? undefined : newStatus;
        const params = new URLSearchParams(searchParams.toString());

        if (!updatedStatus) {
            params.delete("status");
        } else {
            params.set("status", updatedStatus);
        }

        setStatus(updatedStatus);
        router.push(`/workspaces/${workspaceId}/projects/${projectId}?${params.toString()}`);

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
        router.push(`/workspaces/${workspaceId}/projects/${projectId}?${params.toString()}`);
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
        router.push(`/workspaces/${workspaceId}/projects/${projectId}?${params.toString()}`);
    }

    const handleSearchChange = (newSearch: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!newSearch) {
            params.delete("search");
        } else {
            params.set("search", newSearch);
        }
        setSearch(newSearch);
        router.push(`/workspaces/${workspaceId}/projects/${projectId}?${params.toString()}`);
    }

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["get-tasks", projectId, status, activeTab],
        });
    }, [status, queryClient, projectId]);


    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["get-tasks", projectId, priority, activeTab],
        });
    }, [priority, queryClient, projectId]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["get-tasks", projectId, dueDate, activeTab],
        });
    }, [dueDate, queryClient, projectId]);

    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ["get-tasks", projectId, search, activeTab],
        });
    }, [search, queryClient, projectId]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h2 className='text-xl font-semibold'>Search and Filter</h2>
                <p className='text-muted-foreground text-xs'>
                    Search and filter tasks based on status, priority, and due date.
                </p>
            </div>
            <div className='grid grid-rows-2 grid-cols-2 md:grid-cols-4 md:grid-rows-1 gap-4'>
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
        </div>
    )
}

export default TasksFilterSection