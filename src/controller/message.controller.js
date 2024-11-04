import messageModel from "../model/message.model.js";
import roomModel from "../model/room.model.js";

class Message
{
    static async sendMessage(req, res, next)
    {
        try 
        {
            const {message, status} = req.body;
            const {id:receiverId} = req.params;
            const senderId = req.payload.uid;

            if(!receiverId) return res.status(400).send({message: "Receiver Error"})
                
            // Find or create the room
            let room = await roomModel.findOne({
                users: {$all: [senderId, receiverId]}
            })

            if(!room)
            {
                room = await roomModel.create({
                    users: [senderId, receiverId],
                    messages: []
                })
            }

            // Create and save the message
            const newMessage = new messageModel({
                roomId: room._id,
                senderId,
                receiverId,
                message,
                status
            })

            // Push the new message into the room's messages array
            if (newMessage) {
                room.messages.push(newMessage._id);
            }

            await room.save(); // Save the room after updating
            await newMessage.save(); // Save the message after creation

            // Emit event to both sender and receiver
            const receiverSocketId = req.onlineUsers.get(receiverId);
            const senderSocketId = req.onlineUsers.get(senderId);

            // Emit to the receiver if they are online
            if (receiverSocketId) {
                req.io.to(receiverSocketId).emit("newMessage", newMessage);
            }
            // Emit to the sender for confirmation
            if (senderSocketId) {
                req.io.to(senderSocketId).emit("newMessage", newMessage);
            }
            

            res.status(200).send({message: newMessage})

        } 
        catch (error) 
        {
            console.log("Error in sending message", error);
            next(error)
        }
    }

    static async getMessagesById(req, res, next)
    {
        const {id} = req.params;
        const senderId = req.payload.uid

        try 
        {
            const room = await roomModel.findOne({
                users: { $all:[senderId, id] }
            }).populate('messages');

            if(!room) return res.status(200).send([])

            res.status(200).send(room.messages)

        } 
        catch (error) 
        {
            console.log("Error in fetching message", error);
            next(error)
        }
    }

    static async deleteMessageById(req, res, next)
    {
        const {id} = req.params;
        
        try 
        {
            const findMessage = await messageModel.findById(id)
            if(!findMessage) return res.status(400).send({message: "message not found"})

            const findRoom = await roomModel.findOne({
                messages: id
            });

            if (!findRoom) return res.status(404).json({ message: "Room not found" });

            // Delete the message from the message collection
            await messageModel.findByIdAndDelete(id)

            // Remove the message ID from the room's message array
            await roomModel.updateOne(
                {_id : findRoom._id},
                { $pull : {messages: id} }
            )

            // Emit messageDeleted event to all participants in the room
            req.io.emit("messageDeleted", { messageId: id, roomId: findRoom._id });

            res.status(200).send({message: 'Successfully deleted.'})
        } 
        catch (error) 
        {
            console.log("Error: ", error);
            next(error)
        }
    }
}

export default Message