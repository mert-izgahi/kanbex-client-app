import { getAccessTokenAction } from '@/actions/auth';
import { getWorkspaceAction } from '@/actions/workspaces';
import { PageContent, PageHeader, PageSection } from '@/components/shared/page'
import React from 'react'
import TasksTable from './_components/tasks-table';
import TasksFilters from './_components/tasks-filters';

interface Props {
  params: Promise<{ workspaceId: string }>
}
async function page({ params }: Props) {
  const { workspaceId } = await params;
  const accessToken = await getAccessTokenAction();
  if (!accessToken) return null
  const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: workspaceId });
  if (!workspace) return null
  return (
    <PageContent>
      <PageHeader
        title='Tasks'
        description='Manage your workspace tasks, including name, description, and image.'
        workspaceId={workspaceId}
      />
      <PageSection>
        <TasksFilters workspaceId={workspaceId} />
      </PageSection>
      <PageSection>
        <TasksTable workspaceId={workspaceId} />
      </PageSection>
    </PageContent>
  )
}

export default page