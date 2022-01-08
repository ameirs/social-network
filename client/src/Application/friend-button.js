import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

export default function FriendButton() {
    const { id: otherId } = useParams();
    const [relation, setRelation] = useState("");

    useEffect(() => {
        fetch(`/relation/${otherId}.json`)
            .then((response) => response.json())
            .then(({ relation }) => {
                console.log("relation --> ", relation);
                setRelation(relation);
            });
    }, []);

    function updateRelation () {
                fetch(`/relation/${otherId}.json`, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({ relation }),
                })
                    .then((response) => response.json())
                    .then(({ relation }) => {
                        setRelation(relation);
                    });
  
    };

    return (
        <>
            <button onClick={updateRelation}>{relation}</button>
        </>
    );
}
