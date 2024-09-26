import { Router } from "express";
import Message from "../controller/message.controller.js";
import { verifyAccessToken } from "../utils/firebaseHelper.js";

const messageRoutes = Router()

messageRoutes.get("/:id", verifyAccessToken ,Message.getMessages)
messageRoutes.post("/send/:id", verifyAccessToken ,Message.sendMessage)

export default messageRoutes