"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.post('/set-security-question', auth_1.authenticate, auth_controller_1.setSecurityQuestion);
router.post('/initiate-reset', auth_controller_1.initiatePasswordReset);
router.post('/verify-answer', auth_controller_1.verifySecurityAnswer);
exports.default = router;
