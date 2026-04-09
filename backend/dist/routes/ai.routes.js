"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_controller_1 = require("../controllers/ai.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
// Regular (non-streaming) routes
router.post('/parse-job', ai_controller_1.parseJobDescription);
router.post('/resume-suggestions', ai_controller_1.generateResumeSuggestions);
// Streaming routes
router.post('/parse-job-stream', ai_controller_1.parseJobDescriptionStream);
router.post('/resume-suggestions-stream', ai_controller_1.generateResumeSuggestionsStream);
exports.default = router;
