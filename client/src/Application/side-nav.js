import { Link } from "react-router-dom";

export default function SideNav() {
    return (
        <div className="side-nav">
            {/* <input></input> */}
            <Link to="/map">
                <button>view map</button>
            </Link>
            <div className="side-nav-menu">
                <Link to="/">
                    <div className="menu-points">
                        <img src="/assets/icons/profile.png" alt="profile" />
                        Profile
                    </div>
                </Link>
                <Link to="/users">
                    <div className="menu-points">
                        <img src="/assets/icons/search.png" alt="Find People" />
                        Find People
                    </div>
                </Link>
                {/* <Link to="/friends">
                    <div className="menu-points">
                        <img src="/assets/icons/search.png" alt="Find People" />
                        Friends
                    </div>
                </Link> */}
                <Link to="/feed">
                    <div className="menu-points">
                        <img src="/assets/icons/feed.png" alt="Feed" />
                        Feed
                    </div>
                </Link>
                <Link to="/messenger">
                    <div className="menu-points">
                        <img src="/assets/icons/message.png" alt="Message" />
                        Message
                    </div>
                </Link>
                <Link to="/">
                    <div className="menu-points">
                        <img src="/assets/icons/logout.png" alt="Logout" />
                        Logout
                    </div>
                </Link>
            </div>
            <Link to="/">
                <div className="side-nav-menu menu-points">
                    <img
                        src="/assets/icons/profile-delete.png"
                        alt="Delete Profile"
                    />
                    Delete Profile
                </div>
            </Link>
        </div>
    );
}
