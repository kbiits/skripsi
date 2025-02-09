import fetcher from "../axios/axios";

const endpoint = '/api/users';
const getUsersForChatService = async (token: string) => {
    const resp = await fetcher.get(endpoint, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    })

    return resp.data.data;
}

export default getUsersForChatService;