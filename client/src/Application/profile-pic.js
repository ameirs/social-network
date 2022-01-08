function ProfilePic(props) {
    // console.log(props);
    let { first, last, imgUrl, avatarBig } = props;
    imgUrl = imgUrl || "./assets/profile-pic/default-avatar.png";
    return (
        <div className="profile-pic">
            <img
                className={avatarBig ? avatarBig : "avatar"}
                onClick={props.toggleModal}
                src={imgUrl}
                alt={`${first} ${last}`}
            />
        </div>
    );
}

export { ProfilePic };
