const User = require("../../models/user")
const CustomError = require('../../services/custom-error-handler')
module.exports = async function userExist(req,res,next){
    try{
        const email = req?.body?.email
        if(email){
            const user = await User.findOne({email:email})
            if(user){
                return next(CustomError.alreadyExist("This email already exist"))
            }
            return next()
        }
    }catch(err){
        return next(err)
    }
}