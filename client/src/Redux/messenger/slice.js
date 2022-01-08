
export default function messengerReducer(msgs = null, action) {
    if (action.type == "messenger/receiveMessages") {
        msgs = action.payload.msgs;
    }
    if (action.type == "messenger/receiveMessage") {
        const msgsArr = [...msgs]
        msgsArr.push(action.payload.msg)
        msgs = msgsArr

        // console.log("msg", msgs)
        // console.log("msg", action.payload.msg)
    }
    return msgs;
}

// –––– action creator ––––

export function receiveMessages(msgs) {
    console.log("receiveMessages is called");
    return {
        type: "messenger/receiveMessages",
        payload: { msgs },
    };
}

export function receiveMessage(msg) {
    console.log("receiveMessage is called");
    return {
        type: "messenger/receiveMessage",
        payload: { msg },
    };
}
