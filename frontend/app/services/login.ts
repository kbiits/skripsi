import fetcher from "../axios/axios";
type loginData = {
    token: string;
    user: {
        id: string;
        username: string;
        fullname: string;
        dkf_salt: string;
        dkf_iter: number;
        dkf_algo: string;
        dkf_key_size: number;
        created_at: Date;
        private_key: string;
        iv_private_key: string;
        public_key: string;
    }
};

const loginService = async (username: string, password: string): Promise<loginData> => {
    const resp = await fetcher.post("/api/login", {
        username: username,
        password: password,
    })

    if (resp.status != 200) {
        if (resp.status == 400) {
            throw new Error(resp.data.message);
        }

        throw new Error("status is not 200");
    }

    if (!resp.data || !resp.data?.data) {
        throw new Error("empty data");
    }

    return resp.data.data as loginData;
}

export default loginService;