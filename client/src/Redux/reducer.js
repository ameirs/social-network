import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import messengerReducer from "./messenger/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    msgs: messengerReducer,
});

export default rootReducer;
