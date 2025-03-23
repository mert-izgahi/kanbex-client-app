import React from 'react'
import { PageContent, PageHeader, PageSection } from '@/components/shared/page';
import NotificationList from './_components/notification-list';
import { getWorkspaceAction } from '@/actions/workspaces';
import { auth } from '@/lib/auth';
import { IAccount } from '@/lib/types';

interface Props {
    params: Promise<{ workspaceId: string }>
}
async function page({ params }: Props) {
    const { workspaceId } = await params;
    const session = await auth();
    const user = session?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return null
    const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: workspaceId });
    if(!workspace) return null
    return (
        <PageContent>
            <PageHeader
                title='Notifications'
                description='Manage your workspace settings, including name, description, and image.'
                workspaceId={workspaceId}
            />

            <PageSection>
                <NotificationList workspace={workspace}/>
            </PageSection>


        </PageContent>
    )
}

export default page