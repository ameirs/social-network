
export default function friendsReducer(friendsAndWannabes = null, action) {
    if (action.type == "friends/receivedFriendsAndWannabes") {
        friendsAndWannabes = action.payload.friendsAndWannabes;
    }
    if (action.type == "friends/unfriend") {
        friendsAndWannabes = friendsAndWannabes.filter(
            (friend) => friend.id != action.payload.id
        );
    }

    if (action.type == "friends/accept") {
        friendsAndWannabes = friendsAndWannabes.map((friend) => {
            if (friend.id == action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            } else {
                return friend;
            }
        });
    }
    return friendsAndWannabes;
}

// –––– action creator ––––

export function receiveFriendsAndWannabes(friendsAndWannabes) {
    console.log("receiveFriendsAndWannabes is called");
    return {
        type: "friends/receivedFriendsAndWannabes",
        payload: { friendsAndWannabes },
    };
}

export function unfriend(id) {
    console.log("unfriend is called");
    return {
        type: "friends/unfriend",
        payload: { id },
    };
}

export function accept(id) {
    console.log("accept is called");
    return {
        type: "friends/accept",
        payload: { id },
    };
}
