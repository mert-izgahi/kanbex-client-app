"use clinet";

import { ThemeToggle } from '@/components/shared/theme-toggler'
import UserButton from '@/components/shared/user-button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React, { useMemo } from 'react'
import NotificationsMenu from './notifications-menu';
import { IWorkspace } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/lib/enums';

interface HeaderProps {
    workspace: IWorkspace
}

function Header({ workspace }: HeaderProps) {
    const role = useMemo(() => {
        switch (workspace.currentAccountPermission) {
            case Role.ADMIN:
                return "Admin"
            case Role.MEMBER:
                return "Member"
            case Role.MANAGER:
                return "Manager"
            default:
                return "Unknown"
        }
    }, [workspace.currentAccountPermission])

    return (
        <header className='h-16 bg-sidebar flex items-center px-4 border-b border-sidebar-border'>
            <SidebarTrigger />
            <div className="ms-auto flex items-center gap-2">
                <Badge>{role}</Badge>
                <NotificationsMenu workspace={workspace} />
                <ThemeToggle />
                <UserButton />
            </div>
        </header>
    )
}

export default Header