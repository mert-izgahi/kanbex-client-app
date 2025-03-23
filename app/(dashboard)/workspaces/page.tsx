import { auth } from '@/lib/auth'
import { IAccount, IWorkspace } from '@/lib/types';
import { redirect } from 'next/navigation';
import axios from 'axios';
import InitialWorkspaceModal from './_components/initial-workspace-modal';
import { getWorkspaceAction } from '@/actions/workspaces';

// Server Action
const fetchWorkspaces = async ({ accessToken }: { accessToken: string }): Promise<IWorkspace[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/get-workspaces`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const { result } = await response.data;
    return result as IWorkspace[]
  } catch (error) {
    throw error;
  }
}

async function page() {
  const session = await auth();
  const user = await session?.user as IAccount;
  const accessToken = user?.accessToken;

  if (!accessToken) {
    return redirect("/sign-in");
  }

  const workspaces = await fetchWorkspaces({ accessToken });

  if (workspaces.length > 0) {
    const firstWorkspace = workspaces[0];
    const workspace = await getWorkspaceAction({ accessToken, workspaceId: firstWorkspace._id });
    if (workspace) {
      return redirect(`/workspaces/${workspace._id}`);
    }
  }

  return <>
    <InitialWorkspaceModal />
  </>
}

export default page