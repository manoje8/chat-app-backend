import messageModel from "../model/message.model.js";
import roomModel from "../model/room.model.js";

class Message
{
    static async sendMessage(req, res, next)
    {
        try 
        {
            const {message} = req.body;
            const {id:recieverId} = req.params;
            const senderId = req.payload.uid; // log the request 

            if(!recieverId) return res.status(400).send({message: "Reciever Error"})
                
            // Find or create the room
            let room = await roomModel.findOne({
                users: {$all: [senderId, recieverId]}
            })

            if(!room)
            {
                room = await roomModel.create({
                    users: [senderId, recieverId],
                    messages: []
                })
            }

            // Create and save the message
            const newMessage = new messageModel({
                senderId,
                recieverId,
                message
            })

            // Push the new message into the room's messages array
            if (newMessage) {
                room.messages.push(newMessage._id);
            }

            await room.save(); // Save the room after updating
            await newMessage.save(); // Save the message after creation

            res.status(200).send({message: "Message successfully send"})

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