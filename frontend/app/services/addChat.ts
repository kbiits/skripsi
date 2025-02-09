import fetcher from "../axios/axios";

export const addChatService = async (token: string, recipientsId: string[]) => {
    const resp = await fetcher.post('/api/chats', {
        members: recipientsId,
    }, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })

    return resp.data.data;
}