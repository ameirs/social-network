import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Messenger() {
    const msgs = useSelector((state) => state?.msgs);

    const textareaRef = useRef();
    const chatContainerRef = useRef();

    // useEffect(() => {
    //     setTimeout(function () {
    //         console.log("msgs", msgs);
    //     }, 2000);
    // }, []);

    useEffect(() => {
        chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
    }, [msgs]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <div>
            <div className="side-subscribed" ref={chatContainerRef}>
                {msgs?.map((msg) => (
                    <div key={msg.id} className="msgs-container">
                            <div>
                                <img className="avatar" src={msg.img_url} />
                            </div>
                        <div className="msgs">
                            {/* <p>
                                {msg.first} {msg.last}
                            </p> */}
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                className="input-container"
                placeholder="Enter your chat message here"
                onKeyDown={keyCheck}
            />
        </div>
    );
}
