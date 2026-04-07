"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumeSuggestions = exports.parseJobDescription = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai_1 = __importDefault(require("openai"));
// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new openai_1.default({
            baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
            apiKey: process.env.OPENAI_API_KEY,
        });
        console.log('✅ OpenAI client initialized');
    }
    catch (error) {
        console.error('Failed to initialize OpenAI:', error);
    }
}
else {
    console.log('⚠️ OPENAI_API_KEY not found');
}
const parseJobDescription = async (req, res) => {
    console.log('📝 Parse job description called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        // If no OpenAI, return mock data
        if (!openai) {
            console.log('Using mock data');
            return res.json({
                company: 'Test Company',
                role: 'Software Developer',
                requiredSkills: ['JavaScript', 'React', 'Node.js'],
                niceToHaveSkills: ['TypeScript'],
                seniority: 'entry',
                location: 'Remote'
            });
        }
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-120b:free',
            messages: [
                {
                    role: 'system',
                    content: 'Extract company, role, requiredSkills, niceToHaveSkills, seniority, location from the job description. Return ONLY valid JSON.'
                },
                {
                    role: 'user',
                    content: jobDescription.substring(0, 3000)
                }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response from AI');
        }
        const parsed = JSON.parse(content);
        console.log('✅ Parse successful:', parsed);
        res.json(parsed);
    }
    catch (error) {
        console.error('Parse error:', error.message);
        // Return mock data instead of error
        res.json({
            company: 'Sample Company',
            role: 'Developer',
            requiredSkills: ['JavaScript', 'React'],
            niceToHaveSkills: [],
            seniority: 'entry',
            location: 'Remote'
        });
    }
};
exports.parseJobDescription = parseJobDescription;
const generateResumeSuggestions = async (req, res) => {
    console.log('📝 Generate suggestions called');
    try {
        const { jobDescription } = req.body;
        if (!openai) {
            return res.json({
                suggestions: [
                    "Built full-stack applications using React and Node.js",
                    "Implemented RESTful APIs with Express and MongoDB",
                    "Collaborated with cross-functional teams to deliver features"
                ]
            });
        }
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-120b:free',
            messages: [
                {
                    role: 'system',
                    content: 'Generate 3 resume bullet points for this job. Return as JSON array: ["point 1", "point 2", "point 3"]'
                },
                {
                    role: 'user',
                    content: jobDescription.substring(0, 3000)
                }
            ],
            response_format: { type: 'json_object' }
        });
        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('No response');
        }
        const result = JSON.parse(content);
        const suggestions = Array.isArray(result) ? result : result.suggestions || [];
        res.json({ suggestions });
    }
    catch (error) {
        console.error('Suggestions error:', error.message);
        res.json({
            suggestions: [
                "Built full-stack applications using React and Node.js",
                "Implemented RESTful APIs with Express and MongoDB",
                "Collaborated with cross-functional teams to deliver features"
            ]
        });
    }
};
exports.generateResumeSuggestions = generateResumeSuggestions;
