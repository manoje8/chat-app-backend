import { Router } from "express";
import Message from "../controller/message.controller.js";
import { verifyAccessToken } from "../utils/firebaseHelper.js";

const messageRoutes = Router()

messageRoutes.get("/:id", verifyAccessToken ,Message.getMessagesById)
messageRoutes.post("/send/:id", verifyAccessToken ,Message.sendMessage)
messageRoutes.delete("/:id", Message.deleteMessageById)

export default messageRoutes