const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
    participants : [
        {
            type : Schema.Types.ObjectId,
            require:true,
            ref:'User'
        }
    ]
},{
    timestamps:true
})

const OneToOneConversation = mongoose.model("OneToOneConversation",conversationSchema)

module.exports = OneToOneConversation