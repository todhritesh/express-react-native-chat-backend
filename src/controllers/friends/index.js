const User = require("../../models/user")
const CustomErrorHandler = require("../../services/custom-error-handler")
const FriendRequest = require('../../models/friendRequest')
const FriendModel = require('../../models/friend')
const {Types} = require('mongoose')
const sendNotification = require('../../services/fcm-notification')
const NAVIGATIONROUTES = require('../../constants/navigation-routes')





module.exports = class Friend {

    static async sendRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId} = req.body
            if(receiverId === senderId) return next(CustomErrorHandler.badRequest())
            const receiver = await User.findOne({_id:receiverId})
            if(!receiver){
                return next(CustomErrorHandler.notFound('User not found'))
            }

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                receiver:receiverId,
            })

            if(existingRequest){
                if(existingRequest.status==='rejected'){
                    existingRequest.status='pending'
                    await existingRequest.save()
                }
            } else {
                await FriendRequest.create({
                    sender:senderId,
                    receiver:receiverId,
                })
            }

            const notification = {
                title:"New Friend Request",
                body:`${req.user.name} sent you a friend request`,
            }
            const payload = {
                NavigationScreen:NAVIGATIONROUTES.FriendRequests,
                userId:req.user._id
                
            }
            await sendNotification(receiver.fcmTokens,notification,payload)
            return res.status(200).json({ message: 'Friend request sent successfully.' });
        }catch(err){
            return next(err)
        }
    }

    
    static async cancelSentRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId} = req.body

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                receiver:receiverId,
                status:'pending'
            })

            if(!existingRequest){
                throw Error("No pending request with this requestId")
            } 
            await existingRequest.deleteOne()
            return res.status(200).json({ message: 'Friend request cancelled successfully.' });
        }catch(err){
            return next(err)
        }
    }
    
    
    static async rejectRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId} = req.body

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                receiver:receiverId,
                status:'pending'
            })

            if(!existingRequest){
                throw Error("No pending request with this requestId")
            } 
            existingRequest.status='rejected'
            await existingRequest.save()
            return res.status(200).json({ message: 'Friend request rejected successfully.' });
        }catch(err){
            return next(err)
        }
    }
    

    static async acceptRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {receiverId} = req.body 

            const receiver = await User.findOne({_id:receiverId})
            
            let newreceiverFriends
            let newSenderFriends

            // friend request status result must == 2
            let friend_request_status_result = 0

            const existingRequest = await FriendRequest.findOne({
                sender : { $in: [senderId, receiverId] },
                receiver : { $in: [senderId, receiverId] },
                status:'pending'
            })


            if(!existingRequest){
                throw Error("No pending request with this requestId")
            } 
            existingRequest.status='accepted'
            await existingRequest.save()

            const senderFriends = await FriendModel.findOne({user:senderId})
            const receiverFriends = await FriendModel.findOne({user:receiverId})

            if(!senderFriends){
                newSenderFriends = new FriendModel({
                    user:senderId,
                })
                newSenderFriends.friends.push(receiverId)
                await newSenderFriends.save()
                friend_request_status_result ++
            }
            if(!receiverFriends){
                newreceiverFriends = new FriendModel({
                    user:receiverId,
                })
                newreceiverFriends.friends.push(senderId)
                await newreceiverFriends.save()
                friend_request_status_result ++
            }

            if(receiverFriends){
                receiverFriends.friends.push(senderId)
                friend_request_status_result ++
            }
            if(senderFriends){
                senderFriends.friends.push(senderId)
                friend_request_status_result ++
            }


            if(friend_request_status_result==2){
                if(receiverFriends){
                    await receiverFriends.save()
                }
                if(senderFriends){
                    await senderFriends.save()
                }
                if(newreceiverFriends){
                    await newreceiverFriends.save()
                }
                if(newSenderFriends){
                    await newSenderFriends.save()
                }
                const notification = {
                    title:"Friend Request Accepted",
                    body:`${req.user.name} has accepted your friend request`,
                }
                const payload = {
                    NavigationScreen:NAVIGATIONROUTES.Friends,
                    userId:req.user._id
                    
                }
                await sendNotification(receiver.fcmTokens,notification,payload)
                return res.status(200).json({ message: 'Friend request accepted successfully.' });
            }


            throw Error("Something went wrong")

        }catch(err){
            return next(err)
        }
    }
    

    static async getFriends(req,res,next){
        try{
            const userId = req.user._id
            
            const friends = await FriendModel.findOne({user:userId}).populate({
                path:'friends',
                select:'-password'
            })

            if(!friends){
                return res.status(200).json({friends:[]})
            }

            return res.status(200).json(friends)

        }catch(err){
            return next(err)
        }
    }
    

    static async getFriendRequests(req,res,next){
        try{
            const userId = req.user._id
            
            const friendRequests =  FriendRequest.find({receiver:userId,status:'pending'}).populate({
                path:'sender',
                select:'-password'
            }).then((docs) => {

                const friendRequests = docs.map(doc=>doc.sender)
                
                return res.status(200).json({ friendRequests });
              });


            // const friendRequests = await FriendRequest.aggregate([
            //     {
            //         $match:{
            //             status:'pending',
            //             // 'receiver':'646d9564a43d54a725f7ce3f',
            //         }
            //     },
            //     // {
            //     //     $lookup:{
            //     //         from:'users',
            //     //         as:'sender',
            //     //         localField:'sender',
            //     //         foreignField:'_id',
            //     //     }
            //     // },
            //     // {
            //     //     $unwind:'$sender',
            //     // },
            //     // {
            //     //     $project:{
            //     //         receiver: 0, updatedAt: 0, 'sender.password': 0 , status:0
            //     //     }
            //     // }
            // ])

            // const friendRequests = await FriendRequest.find({receiver:userId,status:'pending'})
            // console.log(friendRequests)

            // if(!friendRequests){
            //     return res.status(200).json({friendRequests:[]})
            // }

            // return res.status(200).json({friendRequests})

        }catch(err){
            return next(err)
        }
    }

    static async getSentRequests(req,res,next){
        try{
            const userId = req.user._id
            
            const sentRequests =  FriendRequest.find({sender:userId,status:'pending'}).populate({
                path:'receiver',
                select:'-password'
            }).then((docs) => {

                const sentRequests = docs.map(doc=>doc.receiver)
                
                return res.status(200).json({ sentRequests });
              });


            // const friendRequests = await FriendRequest.aggregate([
            //     {
            //         $match:{
            //             status:'pending',
            //             // 'receiver':'646d9564a43d54a725f7ce3f',
            //         }
            //     },
            //     // {
            //     //     $lookup:{
            //     //         from:'users',
            //     //         as:'sender',
            //     //         localField:'sender',
            //     //         foreignField:'_id',
            //     //     }
            //     // },
            //     // {
            //     //     $unwind:'$sender',
            //     // },
            //     // {
            //     //     $project:{
            //     //         receiver: 0, updatedAt: 0, 'sender.password': 0 , status:0
            //     //     }
            //     // }
            // ])

            // const friendRequests = await FriendRequest.find({receiver:userId,status:'pending'})
            // console.log(friendRequests)

            // if(!friendRequests){
            //     return res.status(200).json({friendRequests:[]})
            // }

            // return res.status(200).json({friendRequests})

        }catch(err){
            return next(err)
        }
    }

    static async nonFriends(req,res,next){
        try{
            const userId = req.user._id
            let users
            
            const friends = await FriendModel.findOne({user:userId}).populate({
                path:'friends',
                select:'-password'
            })

            const friends_id = friends?.friends.map(friend=>friend._id.toString())

            if(!friends || !friends_id){
                users = await User.find({}).select('-password')
            } else{
                users = await User.find({_id:{$nin:[userId,...friends_id]}}).select('-password')
            }
            
            
            return res.status(200).json({users:users||[]})

        }catch(err){
            return next(err)
        }
    }


}