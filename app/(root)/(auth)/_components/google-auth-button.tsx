"use client";

import { signInWithGoogleAction } from '@/actions/auth';
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { IoLogoGoogle } from "react-icons/io5";

function GoggleAuthButton() {
  return (
    <Button onClick={async () => {
      await signInWithGoogleAction();
    }} variant={"warning"}>
      <IoLogoGoogle />
      <span>Continue with Google</span>
    </Button>
  )
}

export default GoggleAuthButton