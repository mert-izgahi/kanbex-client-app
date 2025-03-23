import React from 'react'
import ProjectHeader from './_components/project-header'
import { getWorkspaceAction } from '@/actions/workspaces'
import { Role } from '@/lib/enums'
import { redirect } from 'next/navigation'
import { getAccessTokenAction } from '@/actions/auth'
import TaskViewSwitcher from './_components/tasks-view-switcher'
import TasksFilterSection from './_components/tasks-filter-section'

interface Props {
  params: Promise<{ projectId: string, workspaceId: string }>
}
async function page({ params }: Props) {
  const { projectId, workspaceId } = await params;
  const accessToken = await getAccessTokenAction();
  if (!accessToken) return null
  const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: workspaceId });
  if (!workspace) return null
  if (![Role.ADMIN, Role.MANAGER].includes(workspace.currentAccountPermission as Role)) return redirect('/workspaces');
  return (
    <div className='w-full flex flex-col gap-8 p-6 h-[calc(100vh-64px)] overflow-y-auto'>
      <div className='border border-border bg-background rounded-sm p-6'>
        <ProjectHeader projectId={projectId} workspaceId={workspaceId} isAdmin={workspace.currentAccountPermission === Role.ADMIN} />
      </div>

      <div className='border border-border bg-background rounded-sm p-6'>
        <TasksFilterSection projectId={projectId} workspaceId={workspaceId}/>
      </div>
      <div className='border border-border bg-background rounded-sm p-6'>
        <TaskViewSwitcher projectId={projectId} workspaceId={workspaceId} />
      </div>
    </div>
  )
}

export default page