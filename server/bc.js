const { genSalt, hash, compare } = require("bcryptjs");

exports.hash = (password) => genSalt().then((salt) => hash(password, salt));

exports.compare = compare;
