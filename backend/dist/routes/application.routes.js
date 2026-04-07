"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const application_controller_1 = require("../controllers/application.controller");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.get('/', application_controller_1.getApplications);
router.post('/', application_controller_1.createApplication);
router.put('/:id', application_controller_1.updateApplication);
router.delete('/:id', application_controller_1.deleteApplication);
exports.default = router;
