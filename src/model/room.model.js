import { model, Schema, Types } from "mongoose";

const roomSchema = new Schema(
    {
        users: {type: [String]},
        messages: [{type: Types.ObjectId, ref: "messages", default: []}]
    },
    {
        timestamps: true
    },
    {
        collection: "room",
        versionKey: false
    }
)

const roomModel = model('room', roomSchema)

export default roomModel