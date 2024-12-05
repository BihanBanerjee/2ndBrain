import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../utils/error";

const prisma = new PrismaClient();

export const createContent = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const link = req.body.link;
        const type = req.body.type;
    
        const content = await prisma.content.create({
            data: {
                link,
                type,
                title: req.body.title,
                userId: req.user!.id,
                tags: req.body.tags || []
            }
        })
        
        res.status(201).json({
            message: "Content created successfully",
            content: content
        })
    } catch (error) {
        next(error);
    }

}

export const getContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        const content = await prisma.content.findMany({
            where: {
                userId
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })
        res.status(200).json({
            message: "Content fetched successfully",
            content: content
        })

    } catch (error) {
        next(error);
    }
}

export const deleteContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contentId = req.body.contentId;
        
        // Ensure user ID is available
        const userId = req.user?.id;
        if (!userId) {
            return next(errorHandler(401, "User not authenticated"));
        }

        // Delete the content with matching ID and user ID
        const deletedContent = await prisma.content.deleteMany({
            where: {
                id: contentId,
                userId: userId
            }
        });

        // Check if any content was actually deleted
        if (deletedContent.count === 0) {
            return next(errorHandler(404, "Content not found or you do not have permission to delete"));
        }

        res.json({
            message: "Deleted"
        });
    } catch (error) {
        next(error);
    }
}