import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./reset-password";

// class Welcome extends React.Component

function Auth() {
    return (
        <div className="auth-ui-container">
            <BrowserRouter>
                <>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/reset">
                        <ResetPassword />
                    </Route>
                </>
            </BrowserRouter>
        </div>
    );
}

// Welcome()

export { Auth };



