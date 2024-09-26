import { model, Schema } from "mongoose";

const messageSchema = new Schema(
    {
    senderId: {type: String, required: true},
    recieverId: {type: String, required: true},
    message: {type: String, required: true}
    },
    {
        timestamps: true
    },
    {
        collection: 'messages',
        versionKey: false
    }
)

const messageModel = model('messages', messageSchema)

export default messageModel