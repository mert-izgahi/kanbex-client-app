"use client"

import { CreateProjectForm } from '@/components/forms/create-project-form'
import { Modal } from '@/components/shared/modal'
import { TaskPriorityBadge, TaskStatusBadge } from '@/components/shared/task-badges'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useProjectModal } from '@/hooks/use-modals'
import { api } from '@/lib/axios'
import { Role, TaskPriority, TaskStatus } from '@/lib/enums'
import { ITask, IWorkspace, IWorkspaceAnalytics } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'
import { TbFolder, TbUsers, TbHourglassEmpty, TbWindmill, TbListCheck, TbListTree, TbSettings2, TbPlus, TbEye } from 'react-icons/tb'
interface Props {
    workspace: IWorkspace
    accessToken: string
}
function WorspaceDetails({ workspace, accessToken }: Props) {
    const projectModal = useProjectModal();
    const { data: analytics, isLoading } = useQuery<IWorkspaceAnalytics>({
        queryKey: ["workspace-analytics", workspace?._id],

        queryFn: async () => {
            const response = await api.get(`/api/get-workspaces-analytics/${workspace?._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            const { result } = await response.data;
            return result
        },
    })
    return (
        <div className='p-6 flex flex-col gap-12'>
            <div className="flex bg-background px-4 py-8 rounded-sm flex-col gap-2 items-start justify-between border border-border">
                <div className="flex flex-row w-full">
                    <h1 className='text-3xl font-semibold'>{workspace?.name}</h1>
                    {
                        workspace?.currentAccountPermission === Role.ADMIN && <div className="ms-auto">
                            <Button size={"icon"} variant="ghost" asChild>
                                <Link href={`/workspaces/${workspace?._id}/settings`}>
                                    <TbSettings2 className='w-4 h-4' />
                                </Link>
                            </Button>
                        </div>
                    }
                </div>
                <p className='text-muted-foreground text-sm'>{workspace?.description}</p>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className="flex items-center gap-2">
                        <TbListCheck className='text-xl' />
                        <h3 className="text-lg font-medium">Total Projects</h3>
                    </div>
                    <p className="text-2xl font-semibold">{analytics?.projectsCount}</p>
                </div>
                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className="flex items-center gap-2">
                        <TbListTree className='text-xl' />
                        <h3 className="text-lg font-medium">Uncompleted Tasks</h3>
                    </div>
                    <p className="text-2xl font-semibold">{analytics?.unCompleteTasksCount}</p>
                </div>

                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className="flex items-center gap-2">
                        <TbUsers className='text-xl' />
                        <h3 className="text-lg font-medium">Total Members</h3>
                    </div>
                    <p className="text-2xl font-semibold">{analytics?.membersCount}</p>
                </div>

                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className="flex items-center gap-2">
                        <TbFolder className='text-xl' />
                        <h3 className="text-lg font-medium">Total Projects</h3>
                    </div>
                    <p className="text-2xl font-semibold">{analytics?.projectsCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className="flex items-center justify-between w-full">
                            <h1 className='font-semibold text-xl'>Last Projects</h1>
                            {
                                workspace.currentAccountPermission === Role.ADMIN && <>
                                    <Button variant='ghost' type='button' onClick={projectModal.onOpen} className='flex items-center gap-2'>
                                        <TbPlus className='w-4 h-4' />
                                        New Project
                                    </Button>

                                    <Modal title='New Project' description='Create a new project' isOpen={projectModal.isOpen} onClose={projectModal.onClose}>
                                        <CreateProjectForm workspace={workspace} />
                                    </Modal>
                                </>
                            }
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    {
                                        workspace.currentAccountPermission === Role.ADMIN && <TableHead className="text-right">Actions</TableHead>
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {analytics?.lastProjects.map((project) => (
                                    <TableRow key={project._id}>
                                        <TableCell className='flex items-center gap-2'>
                                            <TbFolder className='w-4 h-4' />
                                            {project.name}
                                        </TableCell>
                                        {
                                            workspace.currentAccountPermission === Role.ADMIN && <TableCell className="text-right">
                                                <Button asChild variant="ghost">
                                                    <Link href={`/workspaces/${workspace._id}/projects/${project._id}`} className="mr-2">
                                                        <TbEye className='w-4 h-4' />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className='bg-background px-4 py-8 rounded-sm flex flex-col gap-2 items-start justify-start border border-border'>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className="flex items-center justify-between w-full">
                            <h1 className='font-semibold text-xl'>Last Tasks</h1>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Statue</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    analytics?.lastTasks?.length === 0 && <TableRow>
                                        <TableCell colSpan={5} className="text-center">No tasks found</TableCell>
                                    </TableRow>
                                }
                                {analytics?.lastTasks && analytics?.lastTasks?.length > 0 && analytics?.lastTasks?.map((task: ITask) => (
                                    <TableRow key={task._id} className='cursor-pointer'>
                                        <TableCell className='flex items-center gap-2'>
                                            <TbListCheck className='w-4 h-4' />
                                            {task.name}
                                        </TableCell>
                                        <TableCell>
                                            <TaskStatusBadge status={task.status as TaskStatus} />
                                        </TableCell>
                                        <TableCell>
                                            <TaskPriorityBadge priority={task.priority as TaskPriority} />
                                        </TableCell>
                                        <TableCell>{dayjs(task.dueDate).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="ghost">
                                                <Link href={`/workspaces/${workspace._id}/tasks/${task._id}`} className="mr-2">
                                                    <TbEye className='w-4 h-4' />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorspaceDetails