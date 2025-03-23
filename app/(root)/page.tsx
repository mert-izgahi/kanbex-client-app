"use client";
import Container from '@/components/ui/container';
import React from 'react'

function page() {
  return (
    <Container className='flex flex-col gap-4 '>
      <div className='flex flex-col gap-4 h-full flex-1 bg-background border border-border p-6 rounded-sm'>
        <div className="flex flex-col gap-1">
          <div className="flex flex-row w-full justify-between gap-2 items-center">
            <h1 className='text-3xl font-semibold'>Kanbax</h1>
            <small>Version 1.0.0</small>
          </div>
          <p className='text-muted-foreground text-sm'>
            Kanbax is a project management tool that allows you to manage your projects and tasks.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default page