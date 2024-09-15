import express from "express";
import {
  renderIndex,
  createMessage,
  renderNewMessageForm,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/", renderIndex);
messageRouter.get("/newMessage", renderNewMessageForm);
messageRouter.post("/newmessage", createMessage);

export { messageRouter };
