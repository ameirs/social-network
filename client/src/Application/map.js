import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMapGl, { Marker, Popup } from "react-map-gl";
// import cities from "cities.json";
import Geocode from "react-geocode";

Geocode.setLanguage("en");
Geocode.setRegion("es");
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();
Geocode.setApiKey(process.env.REACT_APP_API_KEY_GOOGLE);

export default function Map() {
    const [viewport, setViewport] = useState({
        latitude: 51.0834196,
        longitude: 10.4234469,
        width: "100%",
        height: "100%",
        zoom: 5.5,
    });

    const [users, setUsers] = useState([]);
    const [userLocation, setUserLocation] = useState([]);
    const [selectedCity, setselectedCity] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetch("/alluser.json")
            .then((response) => response.json())
            .then((users) => {
                setUsers(users);
            });
    }, []);

    useEffect(() => {
        const coordinatesArray = [];
        users.forEach((user) => {
            coordinatesArray.push(
                Geocode.fromAddress(user.city).then((geodata) => {
                    return {
                        lat: geodata.results[0].geometry.location.lat,
                        lng: geodata.results[0].geometry.location.lng,
                    };
                })
            );
        });
        Promise.all(coordinatesArray).then((coordinates) => {
            const userLocation = users.map((user, i) => {
                return {
                    ...user,
                    ...coordinates[i],
                };
            });

            console.log("userLocation -> ", userLocation);
            setUserLocation(userLocation);
        });
    }, [users]);

useEffect(() => {
    const selectedUsersArray = [];
    users.map((user) => {
        if (user.city == selectedCity.city) {
            selectedUsersArray.push(user);
        }
    });
    console.log("selectedUsersArray", selectedUsersArray);
    setSelectedUsers(selectedUsersArray);
}, [selectedCity]);



useEffect(() => {
    console.log("selectedUsers", selectedUsers);
  
}, [selectedUsers]);


    return (
        <>
            <ReactMapGl
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                // mapStyle="mapbox://styles/annagreunig/ckh5dntpt05qm19obuy598kkn"
                onViewportChange={(viewport) => {
                    setViewport(viewport);
                }}
            >
                {userLocation?.map((user) => (
                    <Marker
                        key={user.id}
                        latitude={user.lat}
                        longitude={user.lng}
                    >
                        <div
                            className="marker"
                            onMouseEnter={(e) => {
                                e.preventDefault();
                                setselectedCity(user);
                            }}
                        >
                            <p>{user.num_city}</p>
                        </div>
                    </Marker>
                ))}
                {selectedCity ? (
                    <Popup
                        latitude={selectedCity.lat}
                        longitude={selectedCity.lng}
                    >
                        <div>
                            {selectedCity.city} 
                        </div>
                        {selectedUsers?.map((user) => (
                            <Link to={`/user/${user.id}`}>
                                <div>
                                    {user.first} {user.last}
                                </div>
                            </Link>
                        ))}
                    </Popup>
                ) : null}
            </ReactMapGl>
        </>
    );
}
