import express from "express";
import messageRoutes from "./message.routes.js";
import userRoutes from "./user.routes.js";

const router = express()

router.use('/message', messageRoutes)
router.use("/users", userRoutes)

export default router