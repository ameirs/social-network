function loggedIn(req, res, next) {
    console.log("checking logged in");
    if (!req.session.userId) {
        return res.redirect("/register");
    }
    next();
}

function hasNotSigned(req, res, next) {
    if (!req.session.userSigned) {
        return res.redirect("/profile");
    }
}

function notLoggedIn(req, res, next) {
    console.log("checking home route access");
    if (req.session.userId && req.session.userSigned) {
        console.log("user has id");
        return res.redirect("/thanks");
    }
    next();
}

module.exports = {
    loggedIn,
    hasNotSigned,
    notLoggedIn,
};
