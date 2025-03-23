import React from 'react'
import { getAccessTokenAction } from '@/actions/auth';
import { getTaskAction } from '@/actions/tasks';
import { redirect } from 'next/navigation';
import TaskDetails from './_components/task-details';
import ProjectDetails from './_components/project-details';
import Comments from './_components/comments';
import { cn } from '@/lib/utils';
import { getWorkspaceAction } from '@/actions/workspaces';
import { Role } from '@/lib/enums';


interface PageProps {
  params: Promise<{ taskId: string, workspaceId: string }>
}
async function page({ params }: PageProps) {
  const { taskId } = await params;
  const accessToken = await getAccessTokenAction();
  if (!accessToken) return redirect('/sign-in')
  const task = await getTaskAction({ accessToken: accessToken, taskId: taskId });
  const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: task.workspace._id });
  if (!workspace) return redirect('/workspaces');
  return (
    <div className='w-full flex flex-row h-[calc(100vh-64px)]'>
      <div className="flex flex-col xl:flex-row gap-0 md:w-3/4 w-full">
        <div className={cn("w-full flex flex-col h-full overflow-y-auto gap-6  p-6",
          task.project.color ? `bg-${task.project.color}-500` : 'bg-background'
        )}>
          <div className='bg-background py-4 px-6 rounded-sm border border-border'>
            <TaskDetails task={task} accessToken={accessToken} currentAccountPermission={workspace.currentAccountPermission as Role} />
          </div>
          <div className='bg-background py-4 px-6 rounded-sm border border-border'>
            <ProjectDetails projectId={task?.project?._id} />
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/4">
        <div className='bg-background py-4 px-6 rounded-none border-l border-l-border h-full'>
          <Comments task={task} />
        </div>
      </div>
    </div>
  )
}

export default page