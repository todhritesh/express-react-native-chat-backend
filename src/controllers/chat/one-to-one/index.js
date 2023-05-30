const User = require("../../../models/user")
const CustomErrorHandler = require("../../../services/custom-error-handler")
const sendNotification = require('../../../services/fcm-notification')
const NAVIGATIONROUTES = require('../../../constants/navigation-routes')
const OneToOneConversation = require('../../../models/one-to-one-chat/conversation')
const OneToOneMessage = require('../../../models/one-to-one-chat/message')





module.exports = class OneToOneChat {

    static async createConversation(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId} = req.body
            if(receiverId === senderId){
                console.log('receiverId === senderId')
                return next(CustomErrorHandler.badRequest())
            }
            const receiver = await User.findOne({_id:receiverId}).select(['-password','-fcmTokens'])
            if(!receiver){
                console.log('user nto fund - receiver')
                return next(CustomErrorHandler.notFound('User not found'))
            }

            const existingConversation = await OneToOneConversation.findOne({
                participants:{
                    $all:[receiverId,senderId]
                }
            })

            if(existingConversation){
                return res.json({
                    receiver,
                    conversation:existingConversation
                })
            }

            const conversation = OneToOneConversation({
                participants:[
                    senderId,
                    receiverId
                ]
            })
            await conversation.save()
            return res.json({
                receiver,
                conversation
            })
        }catch(err){
            return next(err)
        }
    }

    

    static async getConversations(req,res,next){
        try{
            const senderId = req.user._id

            const {receiverId} = req.query

            // const existingConversations = await OneToOneConversation.aggregate([
            //     {
            //         $match:{
            //             participants:{
            //                 $in:[senderId]
            //             }
            //         }
            //     },
            //     {
            //         $lookup:{
            //             localField:'participants',
            //             foreignField:'_id',
            //             from:'users',
            //             as:'participants'
            //         }
            //     },
            //     {
            //         $unwind:'$participants',
            //     },
            //     {
            //         $match:{
            //             'participants._id':{$ne:senderId}
            //         }
            //     },
            //     {
            //         $project: {
            //           _id: 1,
            //           participants: {
            //             _id: 1,
            //             name: 1,
            //             email: 1,
            //             createdAt: 1,
            //             updatedAt: 1
            //           },
            //           createdAt: 1,
            //           updatedAt: 1
            //         }
            //       }
            // ])

            if(receiverId){
                const existingConversations = await OneToOneConversation.findOne({
                    participants:{
                        $in:senderId
                    }
                }).populate({
                    path:'participants',
                    select:'-password -fcmTokens',
                    match:{
                        _id:{
                            $ne:senderId
                        }
                    }
                })
                
                return res.json({
                    conversation:existingConversations
                })
            }else{
                
                const existingConversations = await OneToOneConversation.find({
                    participants:{
                        $in:senderId
                    }
                }).populate({
                    path:'participants',
                    select:'-password -fcmTokens',
                    match:{
                        _id:{
                            $ne:senderId
                        }
                    }
                })
                
                return res.json({
                    conversations:existingConversations
                })
            }
        }catch(err){
            return next(err)
        }
    }

    

    static async sendMessage(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId,textMsg,messageType,conversationId} = req.body
            const receiver = await User.findOne({_id:receiverId})
            let msg 

            if(!['Text','File'].includes(messageType)) return next(CustomErrorHandler.badRequest("messageType must be File or Text"))

            if(messageType==="Text"){
                msg = await OneToOneMessage.create({
                    textMsg,conversationId,receiver:receiverId,sender:senderId
                })
            }else{

            }

            const message = await OneToOneMessage.findById(msg._id).populate({
                path:'sender receiver',
                select:['-password','-fcmTokens']
            })

            const notification = {
                title:"New Message Received",
                body:`${req.user.name} sent you a message`,
            }
            const payload = {
                NavigationScreen:NAVIGATIONROUTES.Chat,
                userId:req.user._id,
                conversationId
                
            }
            await sendNotification(receiver.fcmTokens,notification,payload)
            
            return res.json({
                message
            })
        }catch(err){
            return next(err)
        }
    }

    
    

    static async getMessages(req,res,next){
        try{
            const senderId = req.user._id
            const {conversationId} = req.query

            const messages = await OneToOneMessage.find({conversationId},{},{sort:{createdAt:-1}}).populate({
                path:'sender receiver',
                select:['-password','-fcmTokens']
            })
            
            return res.json({
                messages
            })
        }catch(err){
            return next(err)
        }
    }

    
    


}