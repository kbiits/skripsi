import fetcher from "../axios/axios"

export const getMessagesByConversationIdService = async (token: string, conversationId: string) => {
    const resp = await fetcher.get(`/api/chats/${conversationId}/messages`, {
        headers: {
            Authorization: 'Bearer ' + token,
        }
    })

    return resp.data.data;
}

export const getConversationByIdService = async (token: string, conversationId: string) => {
    const resp = await fetcher.get(`/api/chats/${conversationId}`, {
        headers: {
            Authorization: 'Bearer ' + token,
        }
    })

    return resp.data.data;
}

export const getConversationsService = async (token: string) => {
    const resp = await fetcher.get('/api/chats', {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })

    return resp.data.data;
}