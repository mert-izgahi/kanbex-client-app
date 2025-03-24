"use client";

import { signInWithGoogleAction } from '@/actions/auth';
import { Button } from '@/components/ui/button'
import { DEFAULT_REDIRECT, signIn } from '@/lib/auth';
import React, { useEffect, useState } from 'react'
import { IoLogoGoogle } from "react-icons/io5";

function GoggleAuthButton() {
  const redirectTo = window.location.href + "/workspaces"
  return (
    <Button onClick={async () => {
      await signInWithGoogleAction();
      window.location.assign(redirectTo);
    }} variant={"warning"}>
      <IoLogoGoogle />
      <span>Continue with Google</span>
    </Button>
  )
}

export default GoggleAuthButton