import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    role: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    }
}, { timestamps: true });
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is Required"],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Email is Required"],
    },
    password: {
        type: String,
        required: [true, "Email is Required"],
        minLength: [8, "Password must contain 8 letters"],
    },
    chats: [chatSchema],
}, { timestamps: true });
export default mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map