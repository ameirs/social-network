import React from "react";
import { Link } from "react-router-dom";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reset: true,
            verify: false,
            success: false,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state);
    }

    reset() {
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("This is the data i got back", data);
                console.log("data.sucess", data.success);

                if (data.verify) {
                    console.log("it went in data success clientside");
                    this.setState({
                        reset: false,
                        verify: true,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }

    verify() {
        fetch("/password/reset/verify", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        reset: false,
                        verify: false,
                        success: true,
                    });
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
                {this.state.reset && (
                    <div className="auth-ui-card ">
                        <h1>Reset Password</h1>
                        <input
                            name="email"
                            placeholder="e-mail"
                            type="email"
                            onChange={(e) => this.handleChange(e)}
                            required
                        />
                        <button onClick={() => this.reset()}>Reset</button>
                    </div>
                )}

                {this.state.verify && (
                    <div className="auth-ui-card ">
                        <h1>Reset Password</h1>
                        {this.state.error && <div className="error">Oops something went wrong!</div>}
                        <input
                            name="code"
                            placeholder="code"
                            type="text"
                            onChange={(e) => this.handleChange(e)}
                            required
                        />
                        <input
                            name="newPassword"
                            placeholder="new password"
                            type="password"
                            onChange={(e) => this.handleChange(e)}
                            required
                        />
                        <button onClick={() => this.verify()}>Confirm</button>
                    </div>
                )}

                {this.state.success && (
                    <div className="auth-ui-card ">
                        <h1>Reset Password</h1>
                        <p>Password successfully changed!</p>
                        <p>
                            <Link to="/login">Loginr</Link>
                        </p>
                    </div>
                )}
                
            </>
        );
    }
}

export { ResetPassword };
