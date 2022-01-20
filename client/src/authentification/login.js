import React from "react";
import { Link } from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        fetch("/login.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    location.replace("/"); 
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    render() {
        return (
            <>
                <div className="auth-ui-card ">
                    <h1>Login</h1>
                    {this.state.error && <div className="error">Oops!</div>}
                    <input
                        name="email"
                        placeholder="e-mail"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <input
                        name="password"
                        placeholder="pasword"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                        required
                    />
                    <button onClick={() => this.submit()}>Login</button>

                    <p>
                        or <Link to="/">Register</Link>
                    </p>
                    <p>
                        <Link to="/reset">Forgot Password?</Link>
                    </p>
                </div>
            </>
        );
    }
}

export { Login };
