const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { compareSync } = require("bcryptjs");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
// const cities = require("cities.json");

// ––––– cheerio –––––––
// const request = require("request")
const cheerio = require("cheerio");
var axios = require("axios");

//   axios.get("https://www.spiced-academy.com/de").then((res) => {
//       // console.log(res.data)
//       const $ = cheerio.load(res.data);

//       const uid = uidSafe.sync(18);
//       const link = "https://www.spiced-academy.com/de";

//       console.log($("h1").html());

//       const hostname = new URL(`${link}`);
//       //   console.log(hostname.hostname);

//       const previewData = {
//           id: `${uid}`,
//           url: `${link}`,
//           domain: `${hostname.hostname}`,
//           title: $('meta[property="og:site_name"]').attr("content"),
//           img: $('meta[property="og:image"]').attr("content"),
//           description: $('meta[name="description"]').attr("content"),
//       };
//       console.log(previewData);
//   });

const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// ––––––– STATIC FILES ––––––––––

const s3 = require("./s3");
const { sendEmail } = require("./ses.js");
const { hash, compare } = require("./bc.js");
const db = require("./db.js");
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;

// ––––––– MIDDLEWARE ––––––––

const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// app.use(
//     cookieSession({
//         secret: COOKIE_SECRET,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//         sameSite: true,
//     })
// );

app.use(cookieSessionMiddleware);
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use((req, res, next) => {
    console.log(`${req.method} | ${req.url}`);
    console.log(req.session);
    next();
});

io.on("connection", (socket) => {
    // Only logged in users should be able to connect
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
});

app.use(
    express.urlencoded({
        extended: false,
    })
);
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

// ––––––– ROUTES ––––––––

app.post("/registration.json", function (req, res) {
    let { first, last, password, email } = req.body;
    hash(password)
        .then((hashedPassword) => {
            return db.addUsers({ first, last, hashedPassword, email });
        })
        .then((data) => {
            req.session.userId = data.rows[0].id;
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("error in SERVER on post /registration.json", err);
            res.json({ error: true });
        });
});

app.get("/user/id.json", function (req, res) {
    // console.log("It went in /user/id.json");
    res.json({ userId: req.session.userId });
});

app.post("/login.json", (req, res) => {
    const { email, password } = req.body;

    db.getHashedPassword(email)
        .then((hashedPassword) => {
            return compare(password, hashedPassword.rows[0].password);
        })
        .then((match) => {
            if (match) {
                db.getUserId(email)
                    .then((data) => {
                        req.session.userId = data.rows[0].id;
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            res.json({ error: true });
            console.log("err in POST Login", err);
        });
});

app.post("/password/reset/start", function (req, res) {
    let { email } = req.body;
    db.confirmUser(email)
        .then((data) => {
            if (data.rows[0].email) {
                const randomString = cryptoRandomString({
                    length: 6,
                });
                db.insertResetCode(randomString, email).then((data) => {
                    console.log("reset code id", data);
                    sendEmail(
                        "mire.map@spicedling.email",
                        "Reset Password",
                        `Here is you're code to reset you're password: ${randomString}`
                    );
                    res.json({ verify: true });
                });
            }
        })
        .catch((err) => {
            console.log("error in confirmUser", err);
        });
});

app.post("/password/reset/verify", function (req, res) {
    let { code, newPassword, email } = req.body;

    db.verifyResetCode(code, email)
        .then((data) => {
            console.log("data.rows[0].code", data.rows[0].code);
            if (data.rows[0].code === code) {
                hash(newPassword)
                    .then((hashedPassword) => {
                        return db.updatePassword({ hashedPassword, email });
                    })
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in updatePassword", err);
                        res.json({ error: true });
                    });
            }
        })
        .catch((err) => {
            console.log("error in verifyResetCode", err);
            res.json({ error: true });
        });
});

app.get("/user/:id.json", function (req, res) {
    let userId;

    if (req.params.id === "own") {
        userId = req.session.userId;
    } else {
        userId = req.params.id;
    }

    db.getUserData(userId)
        .then(({ rows }) => {
            ownId = req.session.userId;
            let {
                first,
                last,
                email,
                img_url: imgUrl,
                bio,
                city,
                created_at,
            } = rows[0];
            res.json({
                first,
                last,
                email,
                imgUrl,
                bio,
                city,
                created_at,
                ownId,
            });
        })
        .catch((err) => {
            console.log("error in /user/:id.json --> ", err);
            res.json({ error: true });
        });
});

app.get("/friends.json", function (req, res) {
    console.log("req.session.userId -> ", req.session.userId);

    db.getFriendsAndWannabies(req.session.userId).then((data) => {
        res.json(data.rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function (req, res) {
    if (req.file) {
        const imgUrl = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        db.insertImage(imgUrl, req.session.userId)
            .then((data) => {
                res.json({ imgUrl });
            })
            .catch((err) => console.log("error in insertImage: ", err));
    } else {
        res.sendStatus(500);
    }
});

app.get("/users.json", function (req, res) {
    console.log("req.session.userId: ", req.session.userId);
    db.latestUsers(req.session.userId)
        .then((data) => {
            // console.log("data.rows: ", data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in /users.json --> ", err);
        });
});

app.get("/user-search/:letter.json", function (req, res) {
    db.searchUsers(req.params.letter, req.session.userId)
        .then((data) => {
            // console.log("data.rows: ", data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in /user-search/:letter.jsons --> ", err);
        });
});

app.get("/relation/:otherId.json", function (req, res) {
    db.getRelation(req.params.otherId, req.session.userId)
        .then((data) => {
            console.log(data.rows);
            if (data.rows.length === 0) {
                res.json({ relation: "Friend Request" });
            } else if (!data.rows[0].accepted) {
                if (data.rows[0].recipient_id === req.session.userId) {
                    res.json({ relation: "Accept Friend Request" });
                } else {
                    res.json({
                        relation: "Chancel Friend Request",
                    });
                }
            } else if (data.rows[0].accepted) {
                res.json({ relation: "Unfriend" });
            } else {
                res.json({ relation: "Friend Request" });
            }
        })
        .catch((err) => {
            console.log("error in GET /relation/:otherId.json --> ", err);
            res.json([]);
        });
});

app.post("/relation/:otherId.json", function (req, res) {
    const ownId = req.session.userId;
    const otherId = req.params.otherId;
    let { relation } = req.body;

    if (relation === "Chancel Friend Request") {
        db.cancel(ownId, otherId)
            .then(() => {
                res.json({ relation: "Friend Request" });
            })
            .catch((err) => {
                console.log("error in cancel --> ", err);
            });
    } else if (relation === "Unfriend") {
        db.unfriend(ownId, otherId)
            .then(() => {
                res.json({ relation: "Friend Request" });
            })
            .catch((err) => {
                console.log("error in unfriend --> ", err);
            });
    } else if (relation === "Accept Friend Request") {
        db.accept(ownId, otherId)
            .then(() => {
                res.json({ relation: "Unfriend" });
            })
            .catch((err) => {
                console.log("error in accept --> ", err);
            });
    } else if (relation === "Friend Request") {
        db.setRelation(ownId, otherId, false)
            .then(() => {
                res.json({ relation: "Chancel Friend Request" });
            })
            .catch((err) => {
                console.log("error in POST /relation/:otherId.json --> ", err);
            });
    }
});

app.get("/alluser.json", function (req, res) {
    db.getAllUser()
        .then((data) => {
            // console.log("data.rows: ", data.rows);
            // const counts = {};
            // data.rows.forEach((user) => {
            //     counts[user.city] = (counts[user.city] || 0) + 1;
            // });
            // console.log("counts", counts);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in /users.json --> ", err);
        });
});

app.post("/add-post", function (req, res) {
    console.log("req.body -> ", req.body);
    console.log("userId -> ", req.session.userId);

    let { postText: post_text, link: preview_url } = req.body;
    let preview_title;
    let preview_img;
    let preview_desc;

    let hostname = new URL(preview_url);
    let domain;

    if (preview_url) {
        // console.log("goes into if else");
        axios
            .get(preview_url)
            .then((res) => {
                const $ = cheerio.load(res.data);
                domain = hostname.hostname;
                preview_title = $('meta[property="og:site_name"]').attr(
                    "content"
                );
                preview_img = $('meta[property="og:image"]').attr("content");
                preview_desc = $('meta[name="description"]').attr("content");
                
            })
            .then(() => {
                console.log(preview_title, preview_img, preview_desc);
                db.insertPost(
                    req.session.userId,
                    post_text,
                    preview_url,
                    preview_title,
                    preview_img,
                    preview_desc
                );
            });
    }
});

app.get("/posts/:id.json", function (req, res) {
    console.log("req.params.id -> ", req.params.id);
    let user_id;
    if (req.params.id == "undefined") {
        user_id = req.session.userId;
        console.log("user_id", user_id);
    } else {
        user_id = req.params.id;
        console.log("user_id", user_id);
    }
    db.getPostsById(user_id)
        .then((data) => {
            // console.log(data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in /posts/:id.json --> ", err);
        });
});

app.get("/allposts.json", function (req, res) {    
    db.getPostsAndUserData()
        .then((data) => {
            console.log(data.rows);
            res.json(data.rows);
        })
        .catch((err) => {
            console.log("error in /posts/:id.json --> ", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// ––––– SOCKET.IO ––––––

io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    // console.log(
    //     `user with socket id ${socket.id} and id ${socket.request.session.userId} just connected`
    // );

    db.getLastTenMessages()
        .then(({ rows }) => {
            // console.log("rows in getLastMessages -> ", rows)
            socket.emit("chatMessages", rows);
        })
        .catch((err) => {
            // console.log("err in getLastMessages ->", err);
        });
    socket.on("newMessage", (message) => {
        // console.log("message -> ", message);
        // console.log("userId -> ", socket.request.session.userId);
        db.insertMessages(socket.request.session.userId, message)
            .then(({ rows }) => {
                // console.log("rows ->", rows[0].id)
                return db.getNewMessage(rows[0].id);
            })
            .then((data) => {
                // console.log("data.rows[0]", data.rows);
                io.emit("newChatMessage", data.rows[0]);
            })
            .catch((err) => {
                console.log("error in messenger", err);
            });
    });
});
