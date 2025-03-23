import { getAccessTokenAction } from '@/actions/auth';
import { getWorkspaceAction } from '@/actions/workspaces';
import React from 'react'
import WorspaceDetails from './_components/workspace-details';
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
    <div className='w-full flex flex-col'>
      <WorspaceDetails workspace={workspace} accessToken={accessToken} />
    </div>
  )
}

export default page