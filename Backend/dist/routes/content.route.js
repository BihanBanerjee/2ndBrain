"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const content_controller_1 = require("../controllers/content.controller");
const verifyUser_1 = require("../utils/verifyUser");
const router = express_1.default.Router();
router.post('/createContent', verifyUser_1.verifyToken, content_controller_1.createContent);
router.get('/getContent', verifyUser_1.verifyToken, content_controller_1.getContent);
router.delete('/deleteContnet', verifyUser_1.verifyToken, content_controller_1.deleteContent);
exports.default = router;
