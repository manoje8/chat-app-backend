import { Router } from "express";
import User from "../controller/user.controller.js";
import { verifyAccessToken } from "../utils/firebaseHelper.js";

const userRoutes = Router()

userRoutes.get("/", verifyAccessToken, User.getUsersForSidebar)

export default userRoutes