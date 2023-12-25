import { connect } from "mongoose";

async function connectToDatabase() {
    try {
        await connect(process.env.MONGO_URL || "");
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
    }
}

export { connectToDatabase };