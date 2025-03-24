"use client";

import { signInWithGithubAction } from '@/actions/auth';
import { Button } from '@/components/ui/button'
import React from 'react'
import { IoLogoGithub } from "react-icons/io5";

function GithubAuthButton() {
  const redirectTo = window.location.href + "/workspaces"
  return (
    <Button onClick={async() => {

      await signInWithGithubAction(redirectTo);
      window.location.assign(redirectTo);
    }} variant={"warning"}>
      <IoLogoGithub />
      <span>Continue with Github</span>
    </Button>
  )
}

export default GithubAuthButton