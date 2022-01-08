import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editor: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.fetchBio = this.fetchBio.bind(this);
    }

    textareaToggle() {
        this.setState({
            editor: !this.state.editor,
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    fetchBio() {
        fetch("/bioedit.json", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((bio) => {
                this.props.updateBio(bio);
            });
    }

    render() {
        return (
            <>
                {this.state.editor && (
                    <textarea
                        defaultValue={this.props.bio}
                        name="draftBio"
                        onChange={this.handleChange}
                    />
                )}

                {!this.state.editor && (
                    <button onClick={() => this.textareaToggle()}>
                        {this.props.bio ? "Edit" : "Add"}
                    </button>
                )}

                {this.state.editor && (
                    <button
                        onClick={() => {
                            this.fetchBio();
                            this.textareaToggle();
                        }}
                    >
                        Save
                    </button>
                )}
            </>
        );
    }
}
