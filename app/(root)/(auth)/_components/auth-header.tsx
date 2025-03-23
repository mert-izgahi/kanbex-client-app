"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Logo from '@/components/shared/logo'
function AuthHeader() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-12 flex flex-col gap-4 items-center justify-center">
            <Logo withLabel />
            <p className='text-sm text-muted-foreground'>
                Kanbex is a free and open source task management app.
            </p>
            <small className='text-xs text-muted-foreground'>
                Please note that Kanbex is in early development and is not suitable for production use.
            </small>
        </motion.div>
    )
}

export default AuthHeader