"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJobDescription = parseJobDescription;
exports.generateResumeSuggestions = generateResumeSuggestions;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Job Application Tracker',
    }
});
async function parseJobDescription(jobDescription) {
    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-120b:free',
            messages: [
                {
                    role: 'system',
                    content: `You are a job description parser. Extract the following information from the job description and return ONLY valid JSON:
          {
            "company": "company name",
            "role": "job title/role",
            "requiredSkills": ["skill1", "skill2"],
            "niceToHaveSkills": ["skill1", "skill2"],
            "seniority": "entry/junior/mid/senior/lead",
            "location": "city, country or remote"
          }
          If a field is not found, use empty string or empty array.`
                },
                {
                    role: 'user',
                    content: jobDescription
                }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Error parsing job description:', error);
        throw new Error('Failed to parse job description');
    }
}
async function generateResumeSuggestions(jobDescription) {
    try {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-120b:free',
            messages: [
                {
                    role: 'system',
                    content: `You are a resume coach. Based on the job description, generate 3-5 specific resume bullet points tailored to this role. 
          Each bullet point should be specific, action-oriented, and highlight relevant skills.
          Return ONLY a JSON array of strings. Example: ["bullet point 1", "bullet point 2"]`
                },
                {
                    role: 'user',
                    content: jobDescription
                }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }
        const result = JSON.parse(content);
        return Array.isArray(result) ? result : result.suggestions || [];
    }
    catch (error) {
        console.error('Error generating suggestions:', error);
        throw new Error('Failed to generate resume suggestions');
    }
}
