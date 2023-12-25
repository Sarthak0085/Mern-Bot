import express from "express";
import { config } from "dotenv";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error.js";
config();
const app = express();
//middlewares
app.use(express.json());
app.use(cors({
    origin: ["mern-bot-client.vercel.app",],
    credentials: true,
}));
//remove it in production
app.use(cookieParser(process.env.COOKIE_SECRET));
app.get("/", (req, res) => {
    res.json("test");
});
app.use("/api/v1", appRouter);
app.use(ErrorMiddleware);
export default app;
//# sourceMappingURL=app.js.map