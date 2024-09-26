import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import Mongo from "./config/dbConnect.js";
import router from "./router/router.js";

dotenv.config()

Mongo.connect()

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use("/", router)

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST']
    }
})

let onlineUsers = new Map()

io.on("connection", (socket) => {
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
})

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))