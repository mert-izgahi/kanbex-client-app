
import React from 'react'

import { PageContent, PageHeader, PageSection } from '@/components/shared/page';
import { getWorkspaceAction } from '@/actions/workspaces';
import { Role } from '@/lib/enums';
import { redirect } from 'next/navigation';
import { getAccessTokenAction } from '@/actions/auth';
import WorkspaceDeleteSection from './_components/workspace-delete-section';
import WorkspaceForm from '@/components/forms/workspace-form';
interface Props {
    params: Promise<{ workspaceId: string }>
}
async function page({ params }: Props) {
    const { workspaceId } = await params;
    const accessToken = await getAccessTokenAction();
    if (!accessToken) return null
    const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: workspaceId });
    if (!workspace) return null
    if (workspace.currentAccountPermission !== Role.ADMIN) return redirect('/workspaces');
    return (
        <PageContent>
            <PageHeader
                title='Workspace Settings'
                description='Manage your workspace settings, including name, description, and image.'
                workspaceId={workspaceId}
            />

            <PageSection>
                <WorkspaceForm mode='edit' workspaceId={workspaceId} />
            </PageSection>

            <PageSection>
                <WorkspaceDeleteSection workspaceId={workspaceId} />
            </PageSection>
        </PageContent>
    )
}

export default page