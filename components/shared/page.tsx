"use client";

import React, { PropsWithChildren} from 'react'
import Container from '../ui/container'
import { cn } from '@/lib/utils'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function PageContent({ children, className }: PropsWithChildren & { className?: string }) {
    return (
        <Container className={cn('flex flex-col gap-12 py-6')}>
            {children}
        </Container>
    )
}

function PageSection({ children, className }: PropsWithChildren & { className?: string }) {
    return (
        <div className={cn('bg-background rounded-md p-6 border border-border', className)}>
            {children}
        </div>
    )
}

interface PageHeaderProps {
    title: string
    description: string
    className?: string
    workspaceId: string
}
function PageHeader({ title, description, workspaceId, className }: PageHeaderProps) {


    return (
        <div className="flex flex-col gap-3 w-full bg-background rounded-md p-6 border border-border">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/workspaces/${workspaceId}`}>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem aria-current="page" className='text-sm'>
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className='text-2xl font-semibold'>{title}</h1>
            <p className='text-muted-foreground text-sm'>
                {description}
            </p>
        </div>
    )
}

export { PageContent, PageSection, PageHeader }