import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function NotFound() {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className="flex flex-col max-w-md w-full gap-4 items-center bg-background border-border border rounded-sm p-12">
                <div className='text-9xl font-bold text-destructive'>404</div>
                <Button asChild variant={"secondary"}>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFound