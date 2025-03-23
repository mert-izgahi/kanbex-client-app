import React from 'react'
import Sidebar from './_components/sidebar';
import Header from './_components/header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { IAccount } from '@/lib/types';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getWorkspaceAction } from '@/actions/workspaces';

interface Props {
  children: React.ReactNode,
  params: Promise<{ workspaceId: string }>
}


async function MainLayout(props: Props) {
  const session = await auth();
  const user = await session?.user as IAccount;
  const accessToken = user?.accessToken;
  if (!accessToken) {
    return redirect("/sign-in");
  }

  

  const params = await props.params;

  const currentWorkspaceId = await params?.workspaceId;
  
  const workspace = await getWorkspaceAction({ accessToken: accessToken, workspaceId: currentWorkspaceId });
  
  
  if (!workspace) {
    return redirect("/workspaces");
  }

  return (
    <SidebarProvider className='w-screen h-screen md:overflow-hidden'>
      <Sidebar workspace={workspace} />
      <main className='flex-1 h-full md:overflow-hidden'>
        <Header workspace={workspace} />
        <div className="p-0 h-full w-full md:overflow-hidden">
          {props.children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default MainLayout