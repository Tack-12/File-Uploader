import expressSession from 'express-session';
import express from "express";
import "dotenv/config";
import { prisma } from './db/prisma.ts';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import path from "node:path";
import { passport } from './utils/passport.ts';
import { userRoutes } from './routes/userRouter.ts';


const app = express();
const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressSession({
        cookie: {
                maxAge: 7 * 24 * 60 * 60 * 1000
        },
        secret: `${process.env.SECRET}`,
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(prisma,
                {
                        checkPeriod: 2 * 60 * 1000,
                        dbRecordIdIsSessionId: true,
                }),
}));

app.use(passport.session());


app.use(express.urlencoded({ extended: false }));

app.use(userRoutes);


app.listen(process.env.PORT, () => {
        console.log("YOUR APP IS UP");
})

