"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyUser_1 = require("../utils/verifyUser");
const brain_controller_1 = require("../controllers/brain.controller");
const router = express_1.default.Router();
router.post('/share', verifyUser_1.verifyToken, brain_controller_1.postLink);
router.delete('/share', verifyUser_1.verifyToken, brain_controller_1.deleteLink);
router.get('/:shareLink', brain_controller_1.getLink);
exports.default = router;
