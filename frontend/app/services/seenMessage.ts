import fetcher from "../axios/axios"

const seenMessageService = async (token: string, chatId: string, messageId: string) => {
    if (!token) {
        return null;
    }

    const resp = await fetcher.post(`/api/chats/${chatId}/messages/${messageId}/seen`, {}, {
        headers: {
            Authorization: "Bearer " + token,
        }
    })

    return resp.data.data;
}

export default seenMessageService;