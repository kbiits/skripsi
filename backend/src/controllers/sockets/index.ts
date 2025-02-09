import { authorize, isUnauthorizedError } from "@thream/socketio-jwt";
import { Server } from "socket.io";
import env from "../../env.js";
import socketOnConnect from "./socket_on_connect.js";
import { instrument } from "@socket.io/admin-ui";

const initSocket = async (io: Server) => {
    instrument(io, {
        auth: false,
        mode: "development",
    });

    io.use(
        authorize({
            secret: env.JWT_SECRET,
            algorithms: ['HS256']
        })
    );

    io.on("connection", socketOnConnect);
    // Handling token expiration
    io.on("connect_error", (error) => {
        console.log('error here', error);

        if (isUnauthorizedError(error)) {
            console.log("User token has expired")
            console.log(error)
        }
    })

    return io;
}

export default initSocket;