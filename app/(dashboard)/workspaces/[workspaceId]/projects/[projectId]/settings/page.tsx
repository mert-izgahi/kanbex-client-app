import React from 'react'
import ProjectSettingsForm from '../../../../../../../components/forms/project-settings-form'
import ProjectDeleteButton from './_components/project-delete-button'
import { PageContent, PageHeader, PageSection } from '@/components/shared/page'
interface Props {
    params: Promise<{ projectId: string, workspaceId: string }>
}
async function page({ params }: Props) {
    const { projectId, workspaceId } = await params
    return (
        <PageContent>
            <PageHeader
                title='Project Settings'
                description='Edit your project settings, including name, description, and image.'
                workspaceId={workspaceId}
            />

            <PageSection>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className='text-xl font-semibold'>Project Settings</h1>
                        <p className='text-muted-foreground text-sm'>
                            Edit your project settings, including name, description, and image.
                        </p>
                    </div>
                    <ProjectSettingsForm projectId={projectId} />
                </div>

            </PageSection>

            <PageSection>
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className='text-xl font-semibold'>Danger Zone</h1>
                        <p className='text-muted-foreground text-sm'>
                            Once you delete this project, there is no going back. Please be certain.
                        </p>
                    </div>
                    <div className="flex flex-row justify-end">
                        <ProjectDeleteButton projectId={projectId} workspaceId={workspaceId} />
                    </div>
                </div>
            </PageSection>
        </PageContent>
    )
}

export default page