const aws = require("aws-sdk");
const { AWS_SECRET, AWS_KEY } = require("../secrets");
const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on the server");
        return res.sendStatus(500);
    }
    console.log("request file: ", req.file);
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("yayyy image is in the cloud");
            next();
            fs.unlink(path, () => console.log("file removed"));
        })
        .catch((err) => {
            console.log("ohohohhhhh image upload went wrong", err);
        });
};
