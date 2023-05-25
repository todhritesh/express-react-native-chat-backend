const User = require("../../models/user")
const CustomErrorHandler = require("../../services/custom-error-handler")
const FriendRequest = require('../../models/friendRequest')
const FriendModel = require('../../models/friend')



module.exports = class Friend {
    static async sendRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {recieverId} = req.body
            if(recieverId === senderId) return next(CustomErrorHandler.badRequest())
            const reciever = await User.count({_id:recieverId})
            if(!reciever){
                return next(CustomErrorHandler.notFound('User not found'))
            }

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                reciever:recieverId,
            })

            if(existingRequest){
                if(existingRequest.status==='rejected'){
                    existingRequest.status='pending'
                    await existingRequest.save()
                }
            } else {
                await FriendRequest.create({
                    sender:senderId,
                    reciever:recieverId,
                })
            }
            return res.status(200).json({ message: 'Friend request sent successfully.' });
        }catch(err){
            return next(err)
        }
    }

    
    static async rejectRequest(req,res,next){
        try{
            const senderId = req.user._id
            const {recieverId} = req.body

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                reciever:recieverId,
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
            const {recieverId} = req.body
            let newRecieverFriends
            let newSenderFriends

            // friend request status result must == 2
            let friend_request_status_result = 0

            const existingRequest = await FriendRequest.findOne({
                sender:senderId,
                reciever:recieverId,
                status:'pending'
            })

            if(!existingRequest){
                throw Error("No pending request with this requestId")
            } 
            existingRequest.status='accepted'
            await existingRequest.save()

            const senderFriends = await FriendModel.findOne({user:senderId})
            const recieverFriends = await FriendModel.findOne({user:recieverId})

            if(!senderFriends){
                newSenderFriends = new FriendModel({
                    user:senderId,
                })
                newSenderFriends.friends.push(recieverId)
                await newSenderFriends.save()
                friend_request_status_result ++
            }
            if(!recieverFriends){
                newRecieverFriends = new FriendModel({
                    user:recieverId,
                })
                newRecieverFriends.friends.push(senderId)
                await newRecieverFriends.save()
                friend_request_status_result ++
            }

            if(recieverFriends){
                recieverFriends.friends.push(senderId)
                friend_request_status_result ++
            }
            if(senderFriends){
                senderFriends.friends.push(senderId)
                friend_request_status_result ++
            }


            if(friend_request_status_result==2){
                if(recieverFriends){
                    await recieverFriends.save()
                }
                if(senderFriends){
                    await senderFriends.save()
                }
                if(newRecieverFriends){
                    await newRecieverFriends.save()
                }
                if(newSenderFriends){
                    await newSenderFriends.save()
                }
                return res.status(200).json({ message: 'Friend request accepted successfully.' });
            }


            throw Error("Something went wrong")

        }catch(err){
            return next(err)
        }
    }
    

    static async getFriends(req,res,next){
        try{
            const senderId = req.user._id
            
            const friends = await FriendModel.findOne({user:senderId}).populate({
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


}