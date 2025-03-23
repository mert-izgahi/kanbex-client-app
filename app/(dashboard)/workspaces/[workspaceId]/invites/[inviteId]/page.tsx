import { PageContent, PageHeader, PageSection } from '@/components/shared/page';
import React from 'react'
import InviteForm from '@/components/forms/invite-form';


interface Props {
  params: Promise<{ inviteId: string, workspaceId: string }>
}
async function page({ params }: Props) {
  const { inviteId, workspaceId } = await params;
  
  return (
    <PageContent>
            <PageHeader
                title='Invite to Workspace'
                description='You have been invited to join a workspace.'
                workspaceId={workspaceId}
            />

            <PageSection>
                <InviteForm inviteId={inviteId} workspaceId={workspaceId} />
            </PageSection>
        </PageContent>
  )
}

export default page