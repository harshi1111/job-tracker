"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_service_1 = require("./services/openai.service");
const testJD = `
Job Title: Full Stack Developer Intern
Company: Khurana Technology Solutions
Location: Remote
Requirements:
- Knowledge of React, Node.js, TypeScript
- Basic understanding of MongoDB
- Good communication skills
Nice to have:
- Experience with Tailwind CSS
- Knowledge of OpenAI API
`;
async function test() {
    try {
        console.log('Testing OpenAI parsing...');
        const result = await (0, openai_service_1.parseJobDescription)(testJD);
        console.log('Result:', JSON.stringify(result, null, 2));
    }
    catch (error) {
        console.error('Error:', error);
    }
}
test();
