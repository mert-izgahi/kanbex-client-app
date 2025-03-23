"use client";

import Logo from '@/components/shared/logo'
import { ThemeToggle } from '@/components/shared/theme-toggler';
import UserButton from '@/components/shared/user-button';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container'
import { cn } from '@/lib/utils';
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import React, { useMemo } from 'react'

interface HeaderProps {
    isAuthenticated: boolean
}

function Header({ isAuthenticated }: HeaderProps) {
    
    const pathname = usePathname();
    const links = [
        {
            label: 'Home',
            href: '/'
        },
        {
            label: 'About',
            href: '/about'
        },
        {
            label: 'Contact',
            href: '/contact'
        }
    ]

    return (
        <header className='h-16 bg-background border-b border-border'>
            <Container className='h-full flex items-center gap-8'>
                <Logo withLabel />

                <div className="flex items-center gap-4 flex-1">
                    <ul className="flex items-center gap-4">
                        {
                            links.map(link => (
                                <li key={link.href} className={
                                    cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                                    )
                                }>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))
                        }
                    </ul>

                    <div className="ms-auto flex items-center gap-4">
                        <ThemeToggle />
                        {
                            isAuthenticated ? <UserButton /> : <Button asChild variant={"success"}>
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        }
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header