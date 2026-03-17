import { Router } from "express";
import { addUserGet, addUser, homePage, userLogin } from "../controllers/userController.ts";
const userRoutes = Router();


//Home Route
userRoutes.get("/", homePage);

//Login Post
userRoutes.post("/logIn", userLogin);

//User Add:
userRoutes.get("/signUp", addUserGet)
userRoutes.post("/signUp", addUser);


export { userRoutes };
