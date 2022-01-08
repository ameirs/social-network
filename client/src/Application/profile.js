import { ProfilePic } from "./profile-pic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, imgUrl, bio, updateBio }) {
    return (
        <>
            <ProfilePic imgUrl={imgUrl} avatarBig="avatarBig" />
                <h3>
                    {first} {last}
                </h3>
            <div className="bio-and-edit-container">
                {bio && <p>{bio}</p>}
                <BioEditor updateBio={updateBio} bio={bio} />
            </div>
        </>
    );
}
