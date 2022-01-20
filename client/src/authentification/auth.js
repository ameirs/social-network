import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import { Login } from "./login";
import { ResetPassword } from "./reset-password";

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

export { Auth };



