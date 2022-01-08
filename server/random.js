const cryptoRandomString = require("crypto-random-string")

const randomString = cryptoRandomString( {
    length:6
})

console.log(randomString)