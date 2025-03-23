"use client";
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

interface LogoProps {
  withLabel?: boolean
}

function Logo({ withLabel }: LogoProps) {
  return (
    <Link href="/" className='flex items-center gap-2'>
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className='bg-success rounded-sm w-8 h-8 flex items-center justify-center' >
        <span className='text-success-foreground font-bold text-lg'>K</span>
      </motion.div>

      {
        withLabel && <span className='text-primary font-bold text-lg'>Kanbex</span>
      }
    </Link>
  )
}

export default Logo