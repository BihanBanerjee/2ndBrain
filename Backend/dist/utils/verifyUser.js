"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const error_1 = require("./error");
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next((0, error_1.errorHandler)(401, "Please login to access this resource"));
    }
    try {
        // Use synchronous verify method with type assertion
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // Ensure the decoded token has the required properties
        if (!decoded || !decoded.id) {
            return next((0, error_1.errorHandler)(401, "Invalid token"));
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        // Handle verification errors (expired token, invalid signature, etc.)
        return next((0, error_1.errorHandler)(401, "Unauthorized"));
    }
};
exports.verifyToken = verifyToken;
