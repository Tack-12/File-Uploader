import bcrypt from "bcryptjs";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { prisma } from "../db/prisma.ts";

const upload = multer({ dest: 'upload/' })

export const homePage = (req: Request, res: Response, next: NextFunction) => {
        try {
                res.render("index");
        } catch (err) {
                next(err);
        }
}

export const userLogin = passport.authenticate('local', {
        failureRedirect: "/",
        successRedirect: "/"
})

export const addUserGet = (req: Request, res: Response, next: NextFunction) => {
        try {
                res.render("signUp")
        } catch (err) {
                next(err)
        }
}

export const addUser = async (req: Request, res: Response, next: NextFunction) => {

        try {
                const { username, password, firstName, lastName } = req.body;
                const hashed_password = await bcrypt.hash(password, 10);

                await prisma.users.create({
                        data: {
                                firstname: firstName,
                                lastname: lastName,
                                password: hashed_password,
                                username: username
                        }
                });
        } catch (err) {
                next(err);
        }
}

export const uploadFiles = (req: Request, res: Response, next: NextFunction) => {
        try {
                res.render("addFiles");
        } catch (err) {
                next(err);
        }
}



export const uploadFilesPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
                const file = req.file['homework'];
                const
        } catch (err) {
                next(err);
        }
}

