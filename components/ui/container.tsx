import React from 'react'
import { cn } from '@/lib/utils'
interface ContainerProps {
    className?: string
    children: React.ReactNode
}

function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("container mx-auto max-w-7xl px-4 md:px-6", className)}>{children}</div>
  )
}

export default Container