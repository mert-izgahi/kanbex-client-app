"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import { dehydrate, HydrationBoundary, QueryClient, useQuery, QueryClientProvider } from '@tanstack/react-query';
export function ReactQueryProvider({ children }: PropsWithChildren) {
    const [queryClient] = useState(() => {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 1,
                },
            },
        })
    })

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </HydrationBoundary>
        </QueryClientProvider>
    )
}
