const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    conversationId:{
        type:Schema.Types.ObjectId,
        ref:"OneToOneConversation",
        require:true
    },
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    messageType:{
        type:String,
        require:true,
        default:'Text',
        enums:['Text','File']
    },
    textMsg:{
        type:String,
    },
},{
    timestamps:true
})

const OneToOneMessage = mongoose.model("OneToOneMessage",messageSchema)

module.exports = OneToOneMessage