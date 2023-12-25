import { Router } from "express";
import { deleteUserChats, generateChat, userChats } from "../controllers/chat.controller.js";
import { verifyToken } from "../utils/token.js";

const chatRoutes = Router();

chatRoutes.post("/new", verifyToken, generateChat);
chatRoutes.get("/all-chats", verifyToken, userChats);
chatRoutes.delete("/delete", verifyToken, deleteUserChats);

export default chatRoutes;