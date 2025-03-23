"use client";

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ThemeProvider } from './theme-provider';
import { ReactQueryProvider } from './react-query-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import ModalsProvider from './modals-provider';

function Providers({ children }: PropsWithChildren) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return (
        <ThemeProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ReactQueryProvider>
                <TooltipProvider>
                    {children}
                    <ModalsProvider />
                    <Toaster />
                </TooltipProvider>
            </ReactQueryProvider>
        </ThemeProvider>
    )
}

export default Providers