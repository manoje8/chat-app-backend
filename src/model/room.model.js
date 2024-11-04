import { model, Schema, Types } from "mongoose";

const roomSchema = new Schema(
    {
        users: {type: [String]},
        messages: [{type: Types.ObjectId, ref: "messages", default: []}]
    },
    {
        timestamps: true,
        collection: "rooms",
        versionKey: false
    }
)

const roomModel = model('rooms', roomSchema)

export default roomModel