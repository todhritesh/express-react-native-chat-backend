const CustomErrorHandler = require("../../services/custom-error-handler");
const {DEBUG} = require("../../config")
const {ValidationError} = require("joi");

const errorHandler = (err,req,res,next) => {
    let statusCode = 500 ; 
    let data = {
        message:"Internal server error",
        ...(DEBUG === "true" && {originalError:err.message})
    }

    if(err instanceof ValidationError){
        statusCode = 422

        const validationError = err.details.map(item=>{
            return {
                message : item.message,
                key : item.context.key
            }
        })
        
        data = {
            validationError
        }
    }

    if(err instanceof CustomErrorHandler){
        statusCode = err.status
         data = {
            message:err.message
         }
    }


    return res.status(statusCode).json(data)

}


module.exports = errorHandler