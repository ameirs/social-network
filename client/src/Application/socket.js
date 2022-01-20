import { io } from "socket.io-client"
import { receiveMessages, receiveMessage } from "../redux/messenger/slice.js";
export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("chatMessages", (msgs) =>
            store.dispatch(receiveMessages(msgs))
        );
        socket.on("newChatMessage", (msg) => store.dispatch(receiveMessage(msg)));
    }
};

