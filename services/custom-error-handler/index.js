class CustomErrorHandler extends Error {
    constructor(status,msg){
        super()
        this.status = status ;
        this.message = msg
    }

    static alreadyExist (message) {
        return new CustomErrorHandler(409,message)
    }

    static invalidCredential(message="Email or password is incorrect") {
        return new CustomErrorHandler(401,message)
    }

    static unAuthorized(message="unAuthorized") {
        return new CustomErrorHandler(401,message)
    }

    static pendingEmailVerificaton(message) {
        return new CustomErrorHandler(403,message)
    }

    static notFound(message="Not found") {
        return new CustomErrorHandler(404,message)
    }

    static badRequest(message="Bad request") {
        return new CustomErrorHandler(400,message)
    }
}


module.exports = CustomErrorHandler