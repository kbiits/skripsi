import getConversationMessagesById from '@/app/actions/getConversationById'
import { PropsWithChildren } from 'react'
import ConversationDetailWrapper from './components/ConversationDetailWrapper'

const Layout = async ({ children, params }: PropsWithChildren<{ params: { conversationId: string } }>) => {
    // get conversation messages
    const messages = await getConversationMessagesById(params.conversationId)

    return (
        <ConversationDetailWrapper messages={messages}>
            {children}
        </ConversationDetailWrapper>
    )
}

export default Layout