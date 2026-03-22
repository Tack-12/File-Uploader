import bcrypt from "bcryptjs";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { prisma } from "../db/prisma.ts";
import path from "node:path";
import { supabase } from "../db/supabase.ts";

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
                if (!req.file) {
                        return res.status(400).send("No file uploaded");
                }
                const file_path = `${req.file.originalname}`;
                const file_buffer = req.file?.buffer;
                console.log(file_buffer)

                await supabase.storage.from('files').upload(file_path, file_buffer)
                console.log(req.file);

                const url = supabase.storage.from('files').getPublicUrl(file_path);
                console.log(url.data.publicUrl);

                await prisma.files.create({
                        data: {
                                userId: req.user?.id,
                                filename: file_path,
                                path: url.data.publicUrl,
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
                const file_id = Number(req.params.id);
                const file_name = await prisma.files.findUnique({
                        where: {
                                id: file_id
                        }
                });
                await prisma.files.delete({
                        where: {
                                id: file_id
                        }
                });
                await supabase.storage.from('files').remove([`${file_name?.filename}`])
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
                console.log(file_path);
                res.redirect(file_path);

        } catch (err) {
                next(err);
        }
}

