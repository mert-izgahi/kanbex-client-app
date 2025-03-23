"use client";
import { Modal } from '@/components/shared/modal';
import { Button } from '@/components/ui/button'
import { useInviteWorkspaceModal } from '@/hooks/use-modals';
import {  IWorkspace } from '@/lib/types'
import React from 'react'
import { TbUsersPlus } from 'react-icons/tb'
import SendInviteForm from '@/components/forms/send-invite-form';

interface Props {
  workspace: IWorkspace
}

function InviteMembersSection({ workspace }: Props) {
  const inviteModal = useInviteWorkspaceModal();
  return (
    <div className='flex flex-row items-center gap-2'>
      <h3 className='text-lg font-semibold'>Invite Members</h3>
      <p className='text-xs text-muted-foreground'>Invite people to your workspace and give them access to your workspace</p>

      <Button type='button' className='ms-auto' variant={"success"} onClick={() => inviteModal.onOpen()}>
        <TbUsersPlus className='mr-2 h-4 w-4' />
        Invite Members
      </Button>

      <Modal
        isOpen={inviteModal.isOpen}
        title="Invite Members"
        onClose={inviteModal.onClose}
        description="Invite Members to your workspace"
      >
        <SendInviteForm workspace={workspace} />
      </Modal>
    </div>
  )
}

export default InviteMembersSection