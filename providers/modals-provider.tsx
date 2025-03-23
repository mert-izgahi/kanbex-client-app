"use client"

import { CreateProjectForm } from '@/components/forms/create-project-form'
import { Modal } from '@/components/shared/modal'
import WorkspaceForm from '@/components/forms/workspace-form'
import { useCreateWorkspaceModal, useProjectModal } from '@/hooks/use-modals'
import React, { PropsWithChildren } from 'react'

function ModalsProvider({ children }: PropsWithChildren) {
    const createWorkspaceModal = useCreateWorkspaceModal();
    const projectModal = useProjectModal();
    return (
        <>
            <Modal title='Create Workspace' description='Create a workspace by filling out the form below, then you can invite your team members to join your workspace, or you can invite them later.' isOpen={createWorkspaceModal.isOpen}
                onClose={createWorkspaceModal.onClose}
            >
                <WorkspaceForm mode="create" />
            </Modal>

        </>
    )
}

export default ModalsProvider