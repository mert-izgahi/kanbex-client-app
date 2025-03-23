import React from 'react'

interface Props {
    children: React.ReactNode
}

async function layout({ children }: Props) {
    return children;
}

export default layout;