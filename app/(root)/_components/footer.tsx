import Container from '@/components/ui/container'
import React from 'react'

function Footer() {
  return (
    <footer className='bg-background text-muted-foreground border-t border-border'>
        <Container className='py-12'>
            <p className='text-center text-sm'>Copyright &copy; {new Date().getFullYear()} Kanbex. All rights reserved.</p>
        </Container>
    </footer>
  )
}

export default Footer