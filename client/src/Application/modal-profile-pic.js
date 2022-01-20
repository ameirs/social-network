import { Component } from "react";

export default class ModalProfilePic extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setFile = this.setFile.bind(this);
        this.upload = this.upload.bind(this);
    }

    setFile(e) {
        this.setState(
            {
                file: e.target.files[0],
            },
            () => console.log("setFile state --> ", this.state)
        );
    }

    upload() {
        console.log(this.state.file);
        console.log("upload state -->", this.state);
        const formData = new FormData();
        formData.append("file", this.state.file);

        fetch("/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((imgUrl) => {
                if (imgUrl) {
                    this.setState(imgUrl, () =>
                        console.log("state after:", this.state)
                    );
                }
                this.props.updateImgUrl(imgUrl);
            })
            .catch((err) => {
                console.log("error in fetch images from server:", err);
            });
    }

    render() {
        return (
            <div className="upload-modal-container">
                <div className="upload-modal-card">
                    <p onClick={this.props.toggleModal}>x</p>
                    <h1>Upload new profile picture</h1>
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={this.setFile}
                    />
                    <button onClick={this.upload}>Submit</button>
                </div>
            </div>
        );
    }
}
