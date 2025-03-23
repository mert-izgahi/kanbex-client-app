import React from 'react'

interface ErrorStateProps {
    error: any
}
function ErrorState({ error }: ErrorStateProps) {
    return (
        <div className='h-40 flex items-center justify-center'>
            <small className='text-muted-foreground'>
                {error?.response?.data?.message || error?.message || "Something went wrong"}
            </small>
        </div>
    )
}

export default ErrorState