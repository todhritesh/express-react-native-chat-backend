const User = require('../../models/user')
const {hashPassword,comparePassword} = require('../../services/bcrypt')
const CustomError = require('../../services/custom-error-handler')
const JwtService = require('../../services/jwt')


module.exports = class Home {

    static async home (req,res,next) {
        try{
            
            return res.json('home')
            
    
        }catch(err){
            return next(err)
        }
    }
}