import { Router } from "express";
import { addUserGet, addUser, homePage, showFile, deleteFile, userLogin, uploadFiles, uploadFilesPost, downloadFile } from "../controllers/userController.ts";
import { isAuth } from "../controllers/authMiddle.ts";
import { multerSingleMid } from "../controllers/multerMid.ts";
const userRoutes = Router();


//Home Route
userRoutes.get("/", homePage);

//Login Post
userRoutes.post("/logIn", userLogin);

//User Add:
userRoutes.get("/signUp", addUserGet)
userRoutes.post("/signUp", addUser);

//User Post Files
userRoutes.get("/upload", isAuth, uploadFiles);
userRoutes.post("/upload", multerSingleMid, uploadFilesPost);


//File Structure:
userRoutes.get("/folder", isAuth, showFile);
userRoutes.post("/folder/delete/:id", isAuth, deleteFile);
userRoutes.post("/folder/download/:id", isAuth, downloadFile);


export { userRoutes };
