import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Post() {
    const { id } = useParams();
    
    const [link, setLink] = useState("");
    const [addBtn, setAddButton] = useState(false);
    const [postText, setPostText] = useState("");
    const [errorMessage, setErrorMessage] = useState(false);


    useEffect(() => {
        if (postText && link) {
            console.log("link", link);
            fetch("/add-post", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ link, postText }),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                });
        } else {
            setErrorMessage(true);
        }
    }, [addBtn]);

    return (
        <>

            {/* {errorMessage && (<p>Please provide a Text and an Website link</p>)} */}
            <div className="post">
            <p>add new Post</p>
                <input
                    type="text"
                    placeholder="Link"
                    onChange={(e) => setLink(e.target.value)}
                ></input>

                <input
                    type="text"
                    placeholder="Text"
                    onChange={(e) => setPostText(e.target.value)}
                ></input>

                <button onClick={(e) => setAddButton(true)}>add Post</button>
            </div>
        </>
    );
}
