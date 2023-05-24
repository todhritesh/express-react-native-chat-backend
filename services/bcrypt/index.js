const bcrypt = require("bcrypt")

async function hashPassword (data) {
    return await bcrypt.hash(data,10)
}

async function comparePassword (rawData , encryptedData) {
    return await bcrypt.compare(rawData,encryptedData)
}


module.exports = {
    hashPassword,
    comparePassword
}