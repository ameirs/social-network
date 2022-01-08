import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/users.json")
            .then((response) => response.json())
            .then((results) => {
                setUsers(results);
            });
    }, []);

    useEffect(() => {
        if (searchTerm) {
            fetch(`/user-search/${searchTerm}.json`)
                .then((response) => response.json())
                .then((results) => {
                    setUsers(results);
                });
        } else {
            return;
        }
    }, [searchTerm]);

    return (
        <div className="side-subscribed">
            <input
                type="text"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {users.map((each) => (
                <Link to={`/user/${each.id}`} key={each.id}>
                    <div className="people-search-card">
                        <p>
                            {each.first} {each.last}
                        </p>
                        <img
                            className="avatar"
                            src={each.img_url}
                            alt={`${each.first} ${each.last}`}
                            />
                    </div>
                </Link>
            ))}
        </div>
    );
}
