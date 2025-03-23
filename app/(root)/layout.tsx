import React, { PropsWithChildren } from 'react'
import Header from './_components/header'
import Footer from './_components/footer'
import { auth } from '@/lib/auth';

async function layout({ children }: PropsWithChildren) {
  const session = await auth();
  const isAuthenticated = session?.user ? true : false;
  return (
    <div className='min-h-screen flex flex-col gap-4 w-screen'>
      <Header isAuthenticated={isAuthenticated} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default layout