import Container from '@/components/ui/container'
import React, { PropsWithChildren } from 'react'
import AuthHeader from './_components/auth-header'
import Link from 'next/link'

function layout({ children }: PropsWithChildren) {
    return (
        <Container className='flex flex-col gap-4 bg-background rounded-sm border border-border py-12 overflow-y-auto'>
            <AuthHeader />
            <div className="flex-1 flex justify-center">
                <div className="max-w-md w-full">
                    {children}
                </div>
            </div>
            <div className="mt-auto flex-1 flex flex-col justify-end">
                <ul className='flex flex-row items-center justify-center gap-4'>
                    <li className='text-sm'>
                        <Link href="/privacy-policy" className='text-primary'>Privacy Policy</Link>
                    </li>
                    <li className='text-sm'>
                        <Link href="/terms-and-conditions" className='text-primary'>Terms and Conditions</Link>
                    </li>
                </ul>
            </div>
        </Container>
    )
}

export default layout