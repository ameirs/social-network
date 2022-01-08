import ReactDOM from "react-dom";
import { Auth} from "./authentification/auth.js";
import { App } from "./application/app.js";

// –––– REDUX imports –––––––
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import reducer from "./redux/reducer.js";
// –––This for devTools ––––
import { composeWithDevTools } from "redux-devtools-extension";
import { init } from "./application/socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

    const app = (
        <Provider store={store}>
            <App />
        </Provider>
    );


fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Auth />, document.querySelector("main")
            );
        } else {
            init(store);
            ReactDOM.render(app, document.querySelector("main"));
        }
    });



