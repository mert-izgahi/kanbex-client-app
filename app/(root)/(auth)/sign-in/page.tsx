import React from 'react'
import SignInForm from '@/components/forms/sign-in-form'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import GoogleAuthButton from "../_components/google-auth-button"
import Link from 'next/link'
import GithubAuthButton from '../_components/github-auth-button'

function page() {
  return (
    <div className='w-full flex flex-col gap-4 h-full'>
      <SignInForm />
      <div className="flex flex-row items-center">
        <Separator className='flex-1' />
        <span className='w-20 text-center text-sm'>Or</span>
        <Separator className='flex-1' />
      </div>
      <Button asChild>
        <Link href="/sign-up">Create an account</Link>
      </Button>
      <GoogleAuthButton />
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