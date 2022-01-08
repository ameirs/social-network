import { useState, useEffect } from "react";
import { ProfilePic } from "./profile-pic";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function OtherProfile() {
    const [users, setUsers] = useState([]);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        fetch(`/user/${id}.json`)
            .then((response) => response.json())
            .then((results) => {
                if (results.error) {
                    console.log("results: ", results);
                }
                setUsers(results);
            });
    }, []);

    return (
        <>
            <ProfilePic imgUrl={users.imgUrl} avatarBig="avatarBig" />
            <h3>
                {users.first} {users.last}
            </h3>
            {users.bio && <p>{users.bio}</p>}
        </>
    );
}
