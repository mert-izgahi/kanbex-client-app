"use client";
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { IAccount } from '@/lib/types';
import { api } from '@/lib/axios';
import { useSearchParams } from 'next/navigation';
import { Tab, useTaskTabs } from '@/hooks/use-task-tabs';
import TasksListView from './tasks-list-view';
import TasksKanbanView from './tasks-kanban-view';
import TasksTableView from './tasks-table-view';
import TasksCalenderView from './tasks-calender-view';

interface Props {
    projectId: string
    workspaceId: string
}

function TaskViewSwitcher({ projectId, workspaceId }: Props) {
    const session = useSession();
    const user = session.data?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null;

    const searchParams = useSearchParams();
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const dueDate = searchParams.get("dueDate") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = searchParams.get("sortOrder") || undefined;
    const { activeTab, setActiveTab } = useTaskTabs(); // "list" | "board" | "kanban" | "calendar" | "table" 

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ["get-tasks", projectId, status, priority, dueDate, search, sortBy, sortOrder, activeTab],
        queryFn: async () => {
            const response = await api.get(`/api/get-tasks`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    params: {
                        workspaceId,
                        projectId,
                        status,
                        priority,
                        dueDate,
                        search,
                        sortBy,
                        sortOrder
                    }
                })
            const { result } = await response.data;
            return result
        },
        enabled: !!accessToken || !!projectId,
    })
    return (
        <div className='flex flex-col gap-4'>
            <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as Tab)}>
                <TabsList className="mb-8 text-foreground h-auto gap-2 rounded-none border-none bg-transparent px-0 py-1">
                    <TabsTrigger
                        value='list'
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent rounded-sm  relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        List View
                    </TabsTrigger>
                    <TabsTrigger
                        value="kanban"
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent rounded-sm relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Kanban View
                    </TabsTrigger>
                    <TabsTrigger
                        value='table'
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent rounded-sm relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Table View
                    </TabsTrigger>
                    <TabsTrigger
                        value='calender'
                        className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent rounded-sm relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                        Calender View
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <TasksListView tasks={tasks} isLoading={isLoading} error={error} projectId={projectId} workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value="kanban">
                    <TasksKanbanView tasks={tasks} isLoading={isLoading} error={error} projectId={projectId} workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value="table">
                    <TasksTableView tasks={tasks} isLoading={isLoading} error={error} projectId={projectId} workspaceId={workspaceId} />
                </TabsContent>
                <TabsContent value="calender">
                    <TasksCalenderView tasks={tasks} isLoading={isLoading} error={error} projectId={projectId} workspaceId={workspaceId} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TaskViewSwitcher