"use client";

import { signInWithGithubAction } from '@/actions/auth';
import { Button } from '@/components/ui/button'
import React from 'react'
import { IoLogoGithub } from "react-icons/io5";

function GithubAuthButton() {
  return (
    <Button onClick={async() => {
      await signInWithGithubAction();
    }} variant={"warning"}>
      <IoLogoGithub />
      <span>Continue with Github</span>
    </Button>
  )
}

export default GithubAuthButton