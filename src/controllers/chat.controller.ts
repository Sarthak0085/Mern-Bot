import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model.js";
import ChatCompletionMessageParam from 'openai';
import OpenAI from 'openai';
import { configureOpenAI } from "../config/openai-config.js";
// import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import { CatchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";


export const generateChat = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        console.log(message);

        const user = await userModel.findById(res.locals.jwtData.id);
        console.log(user);

        if (!message) {
            return next(new ErrorHandler("Please enter content", 401));
        }


        if (!user) {
            return next(new ErrorHandler("User not registered or token failed", 401));
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return next(new ErrorHandler("Permissions didn't match", 401));
        }

        const chatMessages = user.chats?.map(({ role, content }) => ({ role, content }));

        const newChatMessage = { content: message, role: "user" }
        console.log(newChatMessage);


        chatMessages.push({ role: "user", content: message });
        console.log(chatMessages);


        user.chats.push(newChatMessage);
        console.log(user.chats);


        //send all chats with new one to openAi Api
        const config = configureOpenAI();
        //@ts-ignore
        const openai = new OpenAI(config);

        //get latest response
        const chatResponse = await openai.chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "gpt-3.5-turbo",
            max_tokens: 10,
        });
        console.log(chatResponse);

        if (chatResponse !== undefined) {
            const response = chatResponse.choices[0]?.message;
            user.chats.push(response);
            await user.save();
            return res.status(200).json({ success: true, chats: user.chats });
        } else {
            return next(new ErrorHandler("Failed to generate message", 500));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const userChats = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);

        if (!user) {
            return next(new ErrorHandler("User not registered or token failed", 401));
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({
                success: false,
                message: "Permissions didn't match",
            });
        }

        return res.status(200).json({
            success: true,
            chats: user.chats
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
});

export const deleteUserChats = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered or token failed",
            });
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return next(new ErrorHandler("Permissions didn't match", 401));
        }

        //@ts-ignore
        user.chats = [];

        user.save();

        return res.status(200).json({
            success: true,
            message: "Chat Deleted Successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500))
    }
})