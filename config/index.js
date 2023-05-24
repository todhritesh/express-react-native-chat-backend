require('dotenv').config();


module.exports = {
    PORT : process.env.PORT || 4001,
    MONGODB_URI : process.env.MONGODB_URI,
    DEBUG : process.env.DEBUG,
    JWT_SECRET : process.env.JWT_SECRET,
}