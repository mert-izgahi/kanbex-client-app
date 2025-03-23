"use client";

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function Header() {
    const router = useRouter();
    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row">
                <h1 className='text-2xl font-semibold'>Workspace Settings</h1>
                <Button variant={"link"} className='ms-auto' onClick={() => router.back()}>
                    Back
                </Button>
            </div>
            <p className='text-muted-foreground text-sm'>
                Manage your workspace settings, including name, description, and image.
            </p>
        </div>
    )
}

export default Header