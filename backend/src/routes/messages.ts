import { Router } from "express";
import { createMessage, getMessages } from "../controllers/messages";

const messages = Router();

messages.get("/", getMessages);

messages.post("/", createMessage);

export default messages;
