import express from "express";
import { Server } from "socket.io";
import { createServer } from 'http';
import {handleConnection} from "./socket.js";
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

io.on("connection", (socket) => handleConnection(io, socket));

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`))