import { useSession } from "next-auth/react"

type currentUser = {
    backend_token: string,
    user_id: string,
    fullname: string,
    username: string,
}

const useCurrentUser = (): currentUser | null => {
    const { data, status } = useSession();
    if (status !== 'authenticated') {
        return null
    }

    return data as any;
}

export default useCurrentUser;