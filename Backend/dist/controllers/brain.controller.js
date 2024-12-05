"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLink = exports.deleteLink = exports.postLink = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../utils/hash");
const error_1 = require("../utils/error");
const prisma = new client_1.PrismaClient();
const postLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { share } = req.body;
        const userId = req.user.id;
        if (share) {
            // Try to find existing link for the user
            const existingLink = yield prisma.link.findUnique({
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
            const hash = (0, hash_1.generateUniqueHash)(10);
            // Create new link
            const newLink = yield prisma.link.create({
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
    }
    catch (error) {
        // Pass any unexpected errors to error handling middleware
        next(error);
    }
});
exports.postLink = postLink;
const deleteLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const deleteResult = yield prisma.link.deleteMany({
            where: {
                userId: userId
            }
        });
        // Check if any link was actually deleted
        if (deleteResult.count === 0) {
            return next((0, error_1.errorHandler)(404, "No sharing link found"));
        }
        res.json({
            message: "Sharing link deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteLink = deleteLink;
const getLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const link = yield prisma.link.findFirst({
            where: { hash },
            include: { user: true }, // Include related user details if needed
        });
        if (!link) {
            return next((0, error_1.errorHandler)(404, "Link not found"));
        }
        const content = yield prisma.content.findMany({
            where: {
                userId: link.userId
            }
        });
        const user = yield prisma.user.findUnique({
            where: {
                id: link.userId
            }
        });
        if (!user) {
            return next((0, error_1.errorHandler)(404, "User not found"));
        }
        res.status(200).json({
            message: "Link found",
            link: link,
            content: content,
            user: user
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getLink = getLink;
