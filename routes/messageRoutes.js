import express from "express";
import {
  createMessage,
  renderNewMessageForm,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/newMessage", renderNewMessageForm);
messageRouter.post("/newmessage", createMessage);

export { messageRouter };
