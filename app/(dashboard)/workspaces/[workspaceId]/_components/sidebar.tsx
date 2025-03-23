"use client";

import React from 'react'
import {
    Sidebar as SidebarPrimitive,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarGroupLabel,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenu,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import Logo from '@/components/shared/logo';
import { TbHome, TbChecklist, TbSettings, TbUsers, TbPlus, TbSend } from "react-icons/tb"
import Link from 'next/link';
import WorkspaceSwitcher from './workspaces-switcher';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateWorkspaceModal } from '@/hooks/use-modals';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IWorkspace } from '@/lib/types';
import { Role } from '@/lib/enums';
import ProjectsList from './projects-list';


interface Props {
    workspace: IWorkspace
}

function Sidebar({ workspace }: Props) {
    const createWorkspaceModal = useCreateWorkspaceModal();
    const pathname = usePathname();
    if (!workspace) {
        return null
    }

    const navigations = [
        {
            label: "Home",
            href: `/workspaces/${workspace?._id}`,
            icon: TbHome,
            isActive: pathname === `/workspaces/${workspace?._id}`
        },
        {
            label: "My Tasks",
            href: `/workspaces/${workspace?._id}/tasks`,
            icon: TbChecklist,
            isActive: pathname === `/workspaces/${workspace?._id}/tasks`
        },
        {
            label: "Members",
            href: `/workspaces/${workspace?._id}/members`,
            icon: TbUsers,
            isActive: pathname === `/workspaces/${workspace?._id}/members`
        },
        // {
        //     label:"Invites",
        //     href: `/workspaces/${workspace?._id}/invites`,
        //     icon: TbSend,
        //     isActive: pathname === `/workspaces/${workspace?._id}/invites`
        // },
        // {
        //     label: "Settings",
        //     href: `/workspaces/${workspace?._id}/settings`,
        //     icon: TbSettings,
        //     isActive: pathname === `/workspaces/${workspace?._id}/settings`
        // },
    ]
    return (
        <>
            <SidebarPrimitive >
                <SidebarHeader className='h-16 flex flex-row items-center p-4 border-b border-sidebar-border'>
                    <Logo withLabel />
                </SidebarHeader>

                <SidebarContent className='flex-1'>
                    <SidebarGroup>
                        <div className="flex items-center justify-between">
                            <SidebarGroupLabel>Workspaces</SidebarGroupLabel>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button type='button' size={"icon"} variant={"ghost"} onClick={createWorkspaceModal.onOpen}>
                                        <TbPlus className='w-4 h-4' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side='right'>Create Workspace</TooltipContent>
                            </Tooltip>
                        </div>
                        <SidebarGroup>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <WorkspaceSwitcher selectedWorkspaceId={workspace?._id} />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarGroup>
                    <SidebarSeparator />
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarMenu>
                            {navigations.map((nav, i) => (
                                <SidebarMenuItem key={i}>
                                    <SidebarMenuButton asChild className={cn('cursor-pointer rounded-sm', { 'bg-sidebar-accent': nav.isActive })}>
                                        <Link href={nav.href}>
                                            <nav.icon className='mr-2' />
                                            {nav.label}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {
                                workspace.currentAccountPermission === Role.ADMIN && (
                                    <SidebarMenuItem >
                                        <SidebarMenuButton asChild className={cn('cursor-pointer rounded-sm', { 'bg-sidebar-accent': pathname === `/workspaces/${workspace?._id}/settings` })}>
                                            <Link href={`/workspaces/${workspace?._id}/settings`}>
                                                <TbSettings className='mr-2' />
                                                Settings
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroup>
                    <SidebarSeparator />
                    {
                        workspace.currentAccountPermission !== Role.MEMBER && <ProjectsList workspace={workspace} />
                    }
                </SidebarContent>

                <SidebarFooter className='h-16 flex flex-row items-center p-4 border-t border-sidebar-border'>
                    <span className='text-xs text-muted-foreground'>Version 1.0.0 - Beta </span>
                </SidebarFooter>
            </SidebarPrimitive>
        </>
    )
}

export default Sidebar