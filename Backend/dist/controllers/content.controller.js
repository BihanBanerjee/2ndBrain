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
exports.deleteContent = exports.getContent = exports.createContent = void 0;
const client_1 = require("@prisma/client");
const error_1 = require("../utils/error");
const prisma = new client_1.PrismaClient();
const createContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = req.body.link;
        const type = req.body.type;
        const content = yield prisma.content.create({
            data: {
                link,
                type,
                title: req.body.title,
                userId: req.user.id,
                tags: req.body.tags || []
            }
        });
        res.status(201).json({
            message: "Content created successfully",
            content: content
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createContent = createContent;
const getContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const content = yield prisma.content.findMany({
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
        });
        res.status(200).json({
            message: "Content fetched successfully",
            content: content
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getContent = getContent;
const deleteContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const contentId = req.body.contentId;
        // Ensure user ID is available
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next((0, error_1.errorHandler)(401, "User not authenticated"));
        }
        // Delete the content with matching ID and user ID
        const deletedContent = yield prisma.content.deleteMany({
            where: {
                id: contentId,
                userId: userId
            }
        });
        // Check if any content was actually deleted
        if (deletedContent.count === 0) {
            return next((0, error_1.errorHandler)(404, "Content not found or you do not have permission to delete"));
        }
        res.json({
            message: "Deleted"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteContent = deleteContent;
