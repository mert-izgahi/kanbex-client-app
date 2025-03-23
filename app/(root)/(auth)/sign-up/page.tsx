import React from 'react'
import SignUpForm from '@/components/forms/sign-up-form'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import GoggleAuthButton from '../_components/google-auth-button'
import GithubAuthButton from '../_components/github-auth-button'


function page() {

  return (
    <div className='w-full flex flex-col gap-4 h-full'>
      <SignUpForm />
      <div className="flex flex-row items-center">
        <Separator className='flex-1' />
        <span className='w-20 text-center text-sm'>Or</span>
        <Separator className='flex-1' />
      </div>
      <Button asChild variant={"secondary"}>
        <Link href="/sign-in">
          I have an account
        </Link>
      </Button>
      <GoggleAuthButton />
      <GithubAuthButton />
      <div className='flex items-center justify-end'>
        <Button asChild variant={"link"}>
          <Link href="/forgot-password" className='text-primary'>Forgot password?</Link>
        </Button>
      </div>
    </div>
  )
}

export default page