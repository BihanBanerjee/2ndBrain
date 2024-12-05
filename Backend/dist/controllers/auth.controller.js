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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.google = exports.signin = exports.signup = void 0;
const error_1 = require("../utils/error");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password || username === "" || email === "" || password === "") {
            return next((0, error_1.errorHandler)(400, "All fields are required"));
        }
        if (password.length < 6) {
            return next((0, error_1.errorHandler)(400, "Password must be at least 6 characters"));
        }
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return next((0, error_1.errorHandler)(400, "User already exists"));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: "User created successfully", user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password || email === "" || password === "") {
            return next((0, error_1.errorHandler)(400, "All fields are required"));
        }
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            return next((0, error_1.errorHandler)(400, "No account with this email has been registered."));
        }
        const isMatch = bcryptjs_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return next((0, error_1.errorHandler)(400, "Invalid password"));
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        const { password: _ } = user, rest = __rest(user, ["password"]);
        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    }
    catch (error) {
        next(error);
    }
});
exports.signin = signin;
const google = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const { password: _ } = user, rest = __rest(user, ["password"]);
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs_1.default.hashSync(generatedPassword, 10);
            const user = yield prisma.user.create({
                data: {
                    username: name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4),
                    email,
                    password: hashedPassword,
                    profilePic: googlePhotoUrl
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            const { password: _ } = user, rest = __rest(user, ["password"]);
            res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.google = google;
