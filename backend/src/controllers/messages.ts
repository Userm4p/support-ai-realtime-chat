import {Request, Response } from "express";

const getMessages = async (req: Request, res: Response) => {
    res.status(200).json([{
        message: "Messages fetched"
    }]);
    return;
}

const createMessage = async (req: Request, res: Response) => {
    res.status(200).json([{
        message: "Message created"
    }]);
    return;
}

export {
    getMessages,
    createMessage
};