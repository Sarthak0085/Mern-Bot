import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token.js";
import { COOKIE_NAME } from "../utils/constants.js";
import { CatchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({
            success: true,
            users
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const register = CatchAsyncError(async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const isUserExist = await userModel.findOne({ email });
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all the details", 401));
        }
        if (isUserExist) {
            return next(new ErrorHandler("User Already Registered. Please login with this email or register with new email", 401));
        }
        if (password.length < 8) {
            return next(new ErrorHandler("Password should atleast 8 characters", 401));
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "mern-bot-server.onrender.com",
            path: "/",
            signed: true,
            secure: true,
            sameSite: "none",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            signed: true,
            domain: "mern-bot-server.onrender.com",
            path: "/",
            expires,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const login = CatchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!email || !password) {
            return next(new ErrorHandler("Please enter both email and password", 401));
        }
        if (!user) {
            return next(new ErrorHandler("User Not found with this Email. Please Register first", 401));
        }
        if (password.length < 8) {
            return next(new ErrorHandler("Password should atleast 8 characters", 401));
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log(isPasswordCorrect);
        if (!isPasswordCorrect) {
            return next(new ErrorHandler("Password doesn't match", 403));
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "mern-bot-server.onrender.com",
            path: "/",
            signed: true,
            secure: true,
            sameSite: "none",
        });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            signed: true,
            domain: "mern-bot-server.onrender.com",
            path: "/",
            expires,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const verifyUser = CatchAsyncError(async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return next(new ErrorHandler("User not registered or token failed", 401));
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return next(new ErrorHandler("Permissions didn't match", 401));
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const logout = CatchAsyncError(async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return next(new ErrorHandler("User not registered or token failed", 401));
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return next(new ErrorHandler("Permissions didn't match", 401));
        }
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            domain: "mern-bot-server.onrender.com",
            path: "/",
            signed: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        });
    }
    catch (error) {
        return next(new ErrorHandler("Permissions didn't match", 500));
    }
});
//# sourceMappingURL=user.controller.js.map