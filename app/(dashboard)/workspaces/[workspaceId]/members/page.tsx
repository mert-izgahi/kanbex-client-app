import React from 'react'
import { PageContent, PageHeader, PageSection } from '@/components/shared/page';
import { getWorkspaceAction } from '@/actions/workspaces';
import InviteMembersSection from './_components/invite-members-section';
import MembersList from './_components/members-list';
import { Role } from '@/lib/enums';
import { getAccessTokenAction } from '@/actions/auth';
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
                title='Workspace Members'
                description={workspace.currentAccountPermission !== Role.MEMBER ? 'Invite members to your workspace.' : 'You are a member of this workspace.'}
                workspaceId={workspaceId}
            />
            {
                workspace.currentAccountPermission === Role.ADMIN && <PageSection>
                    <InviteMembersSection workspace={workspace} />
                </PageSection>
            }

            <PageSection>
                <MembersList workspace={workspace} />
            </PageSection>
        </PageContent>
    )
}

export default page