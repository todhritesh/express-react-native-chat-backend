const User = require('../../models/user')
const {hashPassword,comparePassword} = require('../../services/bcrypt')
const CustomError = require('../../services/custom-error-handler')
const JwtService = require('../../services/jwt')


module.exports = class Auth {
    static async singup (req,res,next) {
        try{
            const body = req.body

            const password = await hashPassword(body.password)
    
            const data = {
                email:body.email,
                name:body.name,
                password
            }
            console.log(data)
    
            const data_res = await User.create(data)
    
            return res.status(201).json({message:'User created successfully'})
        }catch(err){
            return next(err)
        }
    }


    static async login (req,res,next) {
        try{
            const {email,password} = req.body
            
            const user = await User.findOne({email:email})
            if(user){
                const compare = await comparePassword(password,user.password)
                if(!compare){
                    return next(CustomError.invalidCredential())
                }
                const payload = {
                    email,
                    _id:user._id,
                    name:user.name
                }
                const token = JwtService.sign(payload)
                return res.status(200).json({token,user:payload})
            }

            return next(CustomError.notFound("User not found"))
    
        }catch(err){
            return next(err)
        }
    }


    static async login (req,res,next) {
        try{
            const {email,password} = req.body
            
            const user = await User.findOne({email:email})
            if(user){
                const compare = await comparePassword(password,user.password)
                if(!compare){
                    return next(CustomError.invalidCredential())
                }
                const payload = {
                    email,
                    _id:user._id,
                    name:user.name
                }
                const token = JwtService.sign(payload)
                return res.status(200).json({token,user:payload})
            }

            return next(CustomError.notFound("User not found"))
    
        }catch(err){
            return next(err)
        }
    }


    static async authCheck (req,res,next) {
        try{
            const data = {
                user:req.user,
                token:req.auth_token
            }
            
            return res.status(200).json(data)
    
        }catch(err){
            return next(err)
        }
    }
}