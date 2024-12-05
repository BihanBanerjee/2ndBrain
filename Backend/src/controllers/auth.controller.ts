import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password || username === "" || email === "" || password === "") {
            return next(errorHandler(400, "All fields are required"));
        }
        if (password.length < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"));
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next(errorHandler(400, "User already exists"));
        }

        const salt: string = await bcryptjs.genSalt(10);
        const hashedPassword: string = await bcryptjs.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: "User created successfully", user: { id: newUser.id, username: newUser.username, email: newUser.email } });

    } catch (error) {
        next(error);
    }

}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password || email === "" || password === "") {
            return next(errorHandler(400, "All fields are required"));
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return next(errorHandler(400, "No account with this email has been registered."));
        }
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return next(errorHandler(400, "Invalid password"));
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
        
        const { password: _, ...rest } = user;

        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
        
    } catch (error) {
        next(error);
    }
}

export const google = async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
            
            const { password: _, ...rest } = user;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const user = await prisma.user.create({
                data: {
                    username: name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4),
                    email,
                    password: hashedPassword,
                    profilePic: googlePhotoUrl
                }
            })
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
            
            const { password: _, ...rest } = user;
            res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
        }
        } catch (error) {
        next(error);
    }

}