import messageModel from "./model/message.model.js";
import roomModel from "./model/room.model.js";

const handleConnection = (io, socket, onlineUsers) => {
    
    console.log('A user connected:', socket.id);


    // Listen for the "addUser" event from the client to track online users
    socket.on("addUser", (userId) => {
        onlineUsers.set(userId, socket.id)
        io.emit("onlineUsers",Array.from(onlineUsers.keys())) // Emit the list of online users
        console.log('User added: ', userId);
        
    })


    // Listen for typing event
    socket.on('typing', ({ senderId, receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', senderId);
        }
    });


    // Listen for stopTyping event
    socket.on('stopTyping', ({ senderId, receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('stopTyping', senderId);
        }
    });
    

    // Handle message sent by sender
    socket.on("messageSent", async ({ messageId, receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
        
        // Update the message status to "delivered" if the receiver is online
        const status = receiverSocketId ? "delivered" : "sent";
        await messageModel.findByIdAndUpdate(messageId, {status}, {new: true});
    
        // Emit the status update to the sender
        socket.emit("messageStatusUpdate", { messageId, status });
    
        // Emit to the receiver if they're online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageStatusUpdate", { messageId, status });
        }
    });

    // Listen for message seen/read by recipient
    socket.on("messageSeen", async ({ senderId, receiverId }) => {
        // Update the message status to "seen"
        const room = await roomModel.findOne({
            users: { $all: [senderId, receiverId] }
        });

        if (!room) return;

        // Update all messages from the sender within the room to "seen" status
        await messageModel.updateMany(
            { roomId: room._id, senderId, status: { $ne: "seen" } },
            { status: "seen" },
            { new: true }
        );
        
        // Notify the sender that the message has been seen
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageStatusUpdate", { status: "seen" });
        }
    });


    socket.on('disconnect', () => {
        for(let [userId, socketId] of onlineUsers.entries())
        {
            if(socket.id === socketId)
            {
                onlineUsers.delete(userId);
                break;
            }
        }

        io.emit("onlineUsers", Array.from(onlineUsers.keys()))
        console.log("A user disconnected:", socket.id);
        
    })
}

export {handleConnection}