import React from "react";
import { Link } from "react-router-dom";


class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        // console.log(this.state);
    }

    submit() {
        // console.log(this.state);
        fetch("/registration.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("This is the data i got back", data);
                console.log("data.success", data.success);

                if (data.success) {
                    console.log("it went in data success clientside");
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
            <div className="auth-ui-card ">
                <h1>sign up</h1>
                {this.state.error && <div className="error">Oops!</div>}
                <input
                    name="first"
                    placeholder="first name"
                    type="text"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
                <input
                    name="last"
                    placeholder="last Name"
                    type="text"
                    onChange={(e) => this.handleChange(e)}
                    required
                />
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
                <button onClick={() => this.submit()}>Register</button>

                <p>
                    or <Link to="/login">Login</Link>
                </p>
            </div>
        );
    }
}

export { Registration };
