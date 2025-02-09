declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            NEXTAUTH_URL?: string
            VERCEL?: "1"
            NEXT_PUBLIC_API_BASE_URL: string
            NEXT_PUBLIC_WS_URL: string
        }
    }
}