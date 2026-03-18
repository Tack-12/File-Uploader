import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.ts";

passport.use(new LocalStrategy(async (username, password, done) => {
        try {
                const rows = await prisma.users.findMany({
                        where: {
                                username: username,
                        }
                });
                const user = rows[0];

                if (!user) {
                        return done(null, false, { message: "incorrect email/password" });
                }

                const hashed_password = user.password;
                const matched = await bcrypt.compare(password, hashed_password);

                if (!matched) {
                        return done(null, false, { message: "incorrect email/password" });
                }

                return done(null, user);
        } catch (err) {
                return done(err);
        }

}));

passport.serializeUser((user: any, done) => {
        if (!user) {
                return done(null, false);
        }
        return done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
        try {
                const row = await prisma.users.findMany({
                        where: {
                                id: id,
                        }
                });
                const user = row[0];

                return done(null, user);
        } catch (err) {
                return done(err);
        }
})

export { passport }
