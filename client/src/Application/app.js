import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { ProfilePic } from "./profile-pic";
import ModalProfilePic from "./modal-profile-pic";
import Profile from "./profile";
import FindPeople from "./find-people.js";
import OtherProfile from "./other-profile";
import SideNav from "./side-nav";
import FriendButton from "./friend-button";
import Friends from "./friends";
import Map from "./map";
import Messenger from "./messenger";
import Feed from "./feed";
import Post from "./post";
import UserFeed from "./user-feed";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalProfilePic: false,
            profile: true,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.updateImgUrl = this.updateImgUrl.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        fetch("/user/own.json")
            .then((response) => response.json())
            .then((data) => {
                this.setState(data);
                // console.log("this.state in app", this.state);
            });
    }

    toggleModal() {
        console.log("toggle been clicked");
        this.setState({
            modalProfilePic: !this.state.modalProfilePic,
        });
    }

    updateImgUrl({ imgUrl }) {
        console.log("imgUrl in parent", imgUrl);
        this.setState({ imgUrl });
    }

    updateBio({ bio }) {
        this.setState({ bio });
    }

    render() {
        return (
            <div className="wrapper-container">
                <BrowserRouter>
                    {this.state.modalProfilePic && (
                        <ModalProfilePic
                            toggleModal={this.toggleModal}
                            updateImgUrl={this.updateImgUrl}
                        />
                    )}

                    {/* –––––––––– SIDE-NAV ––––––––– */}

                    <div className="sidenav-container">
                        <div className="logo">
                            <img src="/assets/logo.svg" alt="logo" />
                        </div>
                        <SideNav />
                    </div>
                    {/* –––––––––– MAIN-VIEW ––––––––– */}
                    <div className="main-container">
                        <Route path="/users">
                            <FindPeople />
                        </Route>

                        {/* <Route path="/friends">
                            <Friends />
                        </Route> */}

                        <Route path="/map">
                            <Map />
                        </Route>
                        <Route path="/messenger">
                            <Messenger />
                        </Route>
                        <Route path="/feed">
                            <div>
                                <Feed />
                            </div>
                        </Route>

                        <Route path="/user/:id">
                            <div>
                                <div className="profile-card">
                                    <OtherProfile />
                                    <FriendButton />
                                </div>
                                <UserFeed />
                            </div>
                        </Route>

                        <Route exact path="/">
                            <div>
                                <div className="profile-card">
                                    {this.state.profile && (
                                        <Profile
                                            updateBio={this.updateBio}
                                            toggleModal={this.toggleModal}
                                            first={this.state.first}
                                            last={this.state.last}
                                            imgUrl={this.state.imgUrl}
                                            bio={this.state.bio}
                                        />
                                    )}
                                    <Post />
                                </div>
                                <UserFeed />
                            </div>
                        </Route>
                    </div>

                    {/* –––––––––– SUBSCRIBER-LIST ––––––––– */}
                    <div className="side-subscribed-container">
                        <ProfilePic
                            toggleModal={this.toggleModal}
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                        />
                        <Friends />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export { App };
