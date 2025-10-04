import express from "express"
import { getAllUsers, getManagers, login, register } from "../controllers/authController.js";

const AuthRoute = express.Router();

AuthRoute.post("/register", register);
AuthRoute.post("/login", login);

AuthRoute.get("/all", getAllUsers);
AuthRoute.get("/managers", getManagers);

export default AuthRoute;