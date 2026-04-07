"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY,
});
async function test() {
    try {
        console.log('Testing API with key:', process.env.OPENAI_API_KEY?.slice(0, 10) + '...');
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-120b:free',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Say "API is working!" in one sentence.' }
            ],
        });
        console.log('✅ Success! Response:', response.choices[0]?.message?.content);
    }
    catch (error) {
        console.error('❌ Error:', error.message);
    }
}
test();
