import { Router } from "express";
import { getAllUsers, login, logout, register, verifyUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/token.js";
const userRoutes = Router();
userRoutes.get("/", getAllUsers);
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/logout", verifyToken, logout);
export default userRoutes;
//# sourceMappingURL=user.routes.js.map