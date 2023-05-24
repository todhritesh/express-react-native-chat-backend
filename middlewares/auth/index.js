const CustomErrorHandler = require("../../services/custom-error-handler")
const JwtService = require("../../services/jwt")

const auth = (req,res,next) => {
    let authHeader = req.headers.authorization

    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized())
    }

    const token = authHeader.split(" ")[1]

    try {

        const {_id , email , name} = JwtService.verify(token)
        const user =  {_id , email , name}
        req.user = user;
        req.auth_token = token;
        next()

    }catch(err){
        return next(CustomErrorHandler.unAuthorized())
    }

}

module.exports = auth