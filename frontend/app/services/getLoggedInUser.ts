import fetcher from "../axios/axios"

export const getLoggedInUserService = async (token: string) => {
    const resp = await fetcher.get(`/api/user`, {
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    })

    const userData = resp.data?.data;

    return userData;
}