import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
    {
        roomId: {type: Types.ObjectId, ref: "rooms"},
        senderId: {type: String, required: true},
        recieverId: {type: String, required: true},
        message: {type: String, required: true},
        status: {type: String}
    },
    {
        timestamps: true,
        collection: 'messages',
        versionKey: false
    }
)

const messageModel = model('messages', messageSchema)

export default messageModel