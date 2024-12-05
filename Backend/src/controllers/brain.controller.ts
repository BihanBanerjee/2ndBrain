import { NextFunction, Request, Response } from "express"
import { PrismaClient } from "@prisma/client";
import { generateUniqueHash } from "../utils/hash";
import { errorHandler } from "../utils/error";


const prisma = new PrismaClient();

export const postLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { share } = req.body;
        const userId = req.user!.id;
        if (share) {
            // Try to find existing link for the user
            const existingLink = await prisma.link.findUnique({
                where: { 
                    userId: userId 
                },
                select: { 
                    hash: true 
                }
            });

            // If link exists, return existing hash
            if (existingLink) {
                res.status(200).json({
                    hash: existingLink.hash
                });
            }

            // Generate new hash 
            const hash = generateUniqueHash(10);

            // Create new link
            const newLink = await prisma.link.create({
                data: {
                    userId: userId,
                    hash: hash
                },
                select: {
                    hash: true
                }
            });

            res.status(201).json({
                hash: newLink.hash
            });
            return;
        } 
    } catch (error) {
        // Pass any unexpected errors to error handling middleware
        next(error);
    }
}

export const deleteLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const deleteResult = await prisma.link.deleteMany({
            where: {
                userId: userId
            }
        })

        // Check if any link was actually deleted
        if (deleteResult.count === 0) {
            return next(errorHandler(404, "No sharing link found"));
        }

        res.json({
            message: "Sharing link deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}


export const getLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hash = req.params.shareLink as string;
        const link = await prisma.link.findFirst({
            where: { hash },
            include: { user: true }, // Include related user details if needed
        });

        if (!link) {
            return next(errorHandler(404, "Link not found"));
        }

        const content = await prisma.content.findMany({
            where: {
                userId: link.userId
            }
        })

        const user = await prisma.user.findUnique({
            where: {
                id: link.userId
            }
        })

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({
            message: "Link found",
            link: link,
            content: content,
            user: user
        });

        return;

    } catch (error) {
        next(error);
    }
}