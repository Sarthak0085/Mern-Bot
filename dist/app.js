import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middleware/error.js";
config();
const app = express();
//middlewares
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
//remove it in production
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1", appRouter);
app.use(ErrorMiddleware);
export default app;
//# sourceMappingURL=app.js.map