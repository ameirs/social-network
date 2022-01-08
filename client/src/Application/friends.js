import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    unfriend,
    accept,
} from "../redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => fw.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => !fw.accepted)
    );

    useEffect(() => {
        fetch("/friends.json")
            .then((response) => response.json())
            .then((results) => {
                dispatch(receiveFriendsAndWannabes(results));
            })
            .then(() => console.log("friends: ", friends));
    }, []);

    const updateRelation = (id, e) => {
        fetch(`/relation/${id}.json`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ relation: e.target.innerHTML }),
        })
            .then((response) => response.json())
            .then((results) => {
                console.log(results);
                if (results.relation === "Friend Request") {
                    dispatch(unfriend(id));
                } else if (results.relation === "Unfriend") {
                    dispatch(accept(id));
                }
            });
    };

    return (
        <div className="side-subscribed">
            <div className="friends-header">Friends</div>
            {friends?.map((friend) => (
                <div className="friends-container">
                    <div className="friends-info">
                        <div className="friends-font">
                            {friend.first} {friend.last}
                        </div>
                        <button
                            onClick={(e) => updateRelation(`${friend.id}`, e)}
                        >
                            Unfriend
                        </button>
                    </div>
                    <Link key={friend.id} to={`/user/${friend.id}`}>
                        <img className="avatar" src={friend.img_url} />
                    </Link>
                </div>
            ))}

            <div className="friends-header">Wannabes</div>
            {wannabes?.map((wannabes) => (
                <div className="friends-container">
                    <div className="friends-info">
                        <div className="friends-font">
                            {wannabes.first} {wannabes.last}
                        </div>
                        <button
                            onClick={(e) => updateRelation(`${wannabes.id}`, e)}
                        >
                            Accept Friend Request
                        </button>
                    </div>
                    <Link key={wannabes.id} to={`/user/${wannabes.id}`}>
                        <img className="avatar" src={wannabes.img_url} />
                    </Link>
                </div>
            ))}
        </div>
    );
}
