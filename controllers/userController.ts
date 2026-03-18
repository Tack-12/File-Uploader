import bcrypt from "bcryptjs";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { prisma } from "../db/prisma.ts";
import path from "node:path";

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
                res.render("addfile");
        } catch (err) {
                next(err);
        }
}



export const uploadFilesPost = async (req: Request, res: Response, next: NextFunction) => {
        try {

                await prisma.files.create({
                        data: {
                                userId: req.user?.id,
                                filename: String(req.file?.originalname),
                                path: String(req.file?.path),
                                size: Number(req.file?.size)
                        }

                })

                res.redirect("/folder");
        } catch (err) {
                next(err);
        }
}


export const showFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
                const files = await prisma.files.findMany({
                        where: {
                                userId: req.user?.id
                        }
                });
                res.render("showFile", { files: files });
        } catch (err) {
                next(err);
        }
}

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
                const file_id = req.params.id
                await prisma.files.delete({
                        where: {
                                id: Number(file_id)
                        }
                });
                res.redirect("/folder");
        } catch (err) {
                next(err);
        }
}

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
                const file_id = req.params.id
                const row = await prisma.files.findFirst({
                        where: {
                                id: Number(file_id)
                        }
                });
                if (!row) {
                        return res.status(500).send("Sorry Could not find the file you tried to delete");
                }
                const file_path = row.path;
                const file_name = row.filename;
                res.set('Content-Disposition', `attachment; filename="${file_name}"`)
                res.sendFile(path.join(__dirname, "../..", file_path));

        } catch (err) {
                next(err);
        }
}
 
