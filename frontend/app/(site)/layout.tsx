"use client";

import { SessionProvider } from 'next-auth/react'
import React, { PropsWithChildren } from 'react'
import RootWrapper from './RootWrapper'

const SiteLayout = ({ children }: PropsWithChildren) => {
    return (
        <SessionProvider>
            <RootWrapper>
                {children}
            </RootWrapper>
        </SessionProvider>
    )
}

export default SiteLayout