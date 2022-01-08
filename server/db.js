const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "socialnetwork";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);
console.log("[db] Connecting to:", database);

module.exports.addUsers = ({ first, last, hashedPassword, email }) => {
    const q = `INSERT INTO users (first, last, password, email)
                VALUES($1, $2, $3, $4)
                RETURNING id`;
    const params = [first, last, hashedPassword, email];
    return db.query(q, params);
};

module.exports.getHashedPassword = (email) => {
    const q = `SELECT password FROM users
                WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUserId = (email) => {
    const q = `SELECT id FROM users
                WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.confirmUser = (email) => {
    const q = `SELECT email FROM users
                WHERE email = $1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.insertResetCode = (code, email) => {
    const q = `INSERT INTO reset_codes (code, email)
                VALUES($1, $2)
                RETURNING id`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.verifyResetCode = (code, email) => {
    const q = `SELECT * FROM reset_codes
                WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
                AND code = $1
                AND email = $2
                ORDER BY created_at ASC
                LIMIT 1`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.updatePassword = (hashedPassword, email) => {
    const q = `UPDATE users 
                SET password = $1
                WHERE email = $2`;
    const params = [hashedPassword, email];
    return db.query(q, params);
};

module.exports.getUserData = (userId) => {
    const q = `SELECT first, last, email, img_url, bio, city, created_at 
                    FROM users
                    WHERE id = $1`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.insertImage = (imgUrl, userId) => {
    const q = `UPDATE users 
                SET img_url = $1
                WHERE id = $2
                RETURNING img_url`;
    const params = [imgUrl, userId];
    return db.query(q, params);
};

module.exports.insertBio = (bio, userId) => {
    const q = `UPDATE users 
                SET bio = $1
                WHERE id = $2
                RETURNING bio`;
    const params = [bio, userId];
    return db.query(q, params);
};

module.exports.latestUsers = (userId) => {
    const q = `SELECT first, last, id, img_url 
                FROM users
                WHERE id != $1
                ORDER BY id DESC
                LIMIT 3`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.searchUsers = (letter, userId) => {
    const q = `  SELECT first, last, id, img_url  
                    FROM users
                    WHERE id != $2
                    AND (first ILIKE $1 
                    OR last ILIKE $1 
                    OR CONCAT (first, ' ', last) ILIKE $1) `;
    const params = [letter + `%`, userId];
    return db.query(q, params);
};

module.exports.getRelation = (otherId, ownId) => {
    const q = ` SELECT * FROM friends
                    WHERE (recipient_id = $1 AND sender_id = $2)
                    OR (recipient_id = $2 AND sender_id = $1);`;
    const params = [otherId, ownId];
    return db.query(q, params);
};

module.exports.setRelation = (ownId, otherId, relation) => {
    const q = ` INSERT INTO friends (sender_id, recipient_id, accepted)
                VALUES($1, $2, $3)`;
    const params = [ownId, otherId, relation];
    return db.query(q, params);
};
module.exports.cancel = (ownId, otherId) => {
    const q = ` DELETE FROM friends 
                    WHERE sender_id = $1
                    AND recipient_id = $2`;
    const params = [ownId, otherId];
    return db.query(q, params);
};
module.exports.unfriend = (ownId, otherId) => {
    const q = `DELETE FROM friends 
                WHERE (recipient_id = $1 AND sender_id = $2)
                OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [ownId, otherId];
    return db.query(q, params);
};
module.exports.accept = (ownId, otherId) => {
    const q = ` UPDATE friends 
                    SET accepted = true
                    WHERE sender_id = $2
                    AND recipient_id = $1`;
    const params = [ownId, otherId];
    return db.query(q, params);
};

module.exports.getFriendsAndWannabies = (userId) => {
    const q = `SELECT users.id, first, last, img_url, accepted
                    FROM friends
                    JOIN users
                    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
`;
    const params = [userId];
    return db.query(q, params);
};

module.exports.getAllUser = () => {
    const q = `SELECT id, first, last, city, 
                (SELECT COUNT(city) FROM users WHERE city = u.city) AS num_city FROM users u`;
    return db.query(q);
};

module.exports.insertMessages = (userId, message) => {
    const q = `INSERT INTO messages (user_id, message)
                VALUES($1, $2)
                RETURNING id`;
    const params = [userId, message];
    return db.query(q, params);
};

module.exports.getLastTenMessages = () => {
    const q = `SELECT users.id, first, last, img_url, messages.id, messages.message, messages.created_at 
                FROM messages
                JOIN users
                ON users.id = messages.user_id
                ORDER BY messages.created_at DESC
                LIMIT 10`;
    return db.query(q);
};

module.exports.getNewMessage = (msg_id) => {
    const q = `SELECT users.id, first, last, img_url, messages.id, messages.message, messages.created_at 
                FROM messages
                JOIN users
                ON users.id = messages.user_id
                WHERE messages.id = $1`;
    const params = [msg_id];
    return db.query(q, params);
};

module.exports.insertPost = (
    user_id,
    post_text,
    preview_url,
    preview_title,
    preview_img,
    preview_desc
) => {
    const q = `INSERT INTO posts 
                (user_id,
                post_text,
                preview_url,
                preview_title,
                preview_img,
                preview_desc)
                VALUES($1, $2, $3, $4, $5, $6)
                RETURNING id`;
    const params = [
        user_id,
        post_text,
        preview_url,
        preview_title,
        preview_img,
        preview_desc,
    ];
    return db.query(q, params);
};

module.exports.getPostsById = (user_id) => {
    const q = `SELECT 
                post_text,
                preview_url,
                preview_title,
                preview_img,
                preview_desc 
                FROM posts
                WHERE user_id = $1
                ORDER BY id DESC`;
    const params = [user_id];
    return db.query(q, params);
};
module.exports.getPostsAndUserData = () => {
    const q = `SELECT users.id, first, last, img_url, 
                post_text, preview_url, preview_title,
                preview_img,
                preview_desc,
                posts.created_at 
                FROM posts
                JOIN users
                ON users.id = posts.user_id
                ORDER BY posts.id DESC`;
    return db.query(q);
};


 
                