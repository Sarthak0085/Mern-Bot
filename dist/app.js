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
const allowedOrigins = ['https://mern-bot-client.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
//remove it in production
app.use(cookieParser(process.env.COOKIE_SECRET));
app.get("/", (req, res) => {
    res.json("test");
});
app.use("/api/v1", appRouter);
app.use(ErrorMiddleware);
export default app;
//# sourceMappingURL=app.js.map