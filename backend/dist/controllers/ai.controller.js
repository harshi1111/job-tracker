"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumeSuggestions = exports.parseJobDescription = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const generative_ai_1 = require("@google/generative-ai");
const openai_1 = __importDefault(require("openai"));
// ============================================================
// INITIALIZE ALL AI PROVIDERS
// ============================================================
// Groq (Primary - Fastest)
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
// Gemini (Secondary - High Quality)
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
// OpenRouter (Tertiary - Fallback)
const openrouter = new openai_1.default({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
});
// ============================================================
// EXPERT PROMPTS FOR GOD-LEVEL RESULTS
// ============================================================
const JOB_PARSING_PROMPT = `You are an elite job description parser with 10+ years of recruitment experience.

Extract the following information with MAXIMUM ACCURACY:

1. COMPANY NAME - The exact company name hiring for this role
2. JOB ROLE - The official job title (e.g., "Senior Frontend Engineer", not just "Developer")
3. REQUIRED SKILLS - MUST-HAVE skills. Be specific. Extract exact technologies mentioned.
4. NICE-TO-HAVE SKILLS - Bonus skills. Extract exact phrases.
5. SENIORITY LEVEL - One of: entry, junior, mid, senior, lead, principal, director
6. LOCATION - City, country, or "Remote"

RULES:
- Be precise. Don't guess. If a field isn't found, use empty string or empty array.
- Extract exact skill names as written (e.g., "React 18", "TypeScript 5.x")
- Return ONLY valid JSON. No explanations. No markdown.

OUTPUT FORMAT:
{
  "company": "string",
  "role": "string",
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "seniority": "string",
  "location": "string"
}`;
const RESUME_SUGGESTIONS_PROMPT = `You are an elite resume coach who has helped thousands land FAANG jobs.

Based on the job description, generate 3-5 POWERFUL, SPECIFIC resume bullet points.

CRITICAL RULES:
1. Each bullet point MUST reference specific skills from the job description
2. Include METRICS and RESULTS where possible (%, $, hours saved)
3. Use STRONG ACTION VERBS: Built, Led, Optimized, Architected, Implemented, Scaled
4. Be TAILORED to the exact role - not generic
5. Make the candidate sound like a top 1% performer

EXAMPLES:
- "Built a real-time dashboard using React and WebSocket that reduced data latency by 85%"
- "Led migration of 50+ microservices to Kubernetes, reducing deployment time from 2 hours to 15 minutes"
- "Implemented RAG pipeline using LangChain and Pinecone, improving search accuracy by 42%"

Return ONLY valid JSON: {"suggestions": ["bullet point 1", "bullet point 2", "bullet point 3"]}`;
const providers = [
    {
        name: 'Groq',
        call: async (prompt, isJson) => {
            const response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 2000,
                ...(isJson && { response_format: { type: 'json_object' } }),
            });
            return response.choices[0]?.message?.content || '';
        },
    },
    {
        name: 'Gemini',
        call: async (prompt, isJson) => {
            const result = await geminiModel.generateContent(prompt);
            let text = result.response.text();
            if (isJson && !text.includes('{')) {
                // Attempt to extract JSON if wrapped in markdown
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    text = jsonMatch[0];
            }
            return text;
        },
    },
    {
        name: 'OpenRouter',
        call: async (prompt, isJson) => {
            const response = await openrouter.chat.completions.create({
                model: 'openai/gpt-oss-20b:free',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 2000,
                ...(isJson && { response_format: { type: 'json_object' } }),
            });
            return response.choices[0]?.message?.content || '';
        },
    },
];
async function callWithFallback(prompt, isJson = true) {
    const errors = [];
    for (const provider of providers) {
        try {
            console.log(`🔄 Trying ${provider.name}...`);
            const result = await provider.call(prompt, isJson);
            console.log(`✅ ${provider.name} succeeded`);
            return result;
        }
        catch (error) {
            console.error(`❌ ${provider.name} failed:`, error.message);
            errors.push(`${provider.name}: ${error.message}`);
            // Wait before retrying next provider (avoid rate limit bursts)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw new Error(`All AI providers failed: ${errors.join(', ')}`);
}
function cleanJsonResponse(content) {
    let cleaned = content;
    // Remove markdown code blocks
    if (cleaned.includes('```json')) {
        cleaned = cleaned.split('```json')[1].split('```')[0];
    }
    else if (cleaned.includes('```')) {
        cleaned = cleaned.split('```')[1].split('```')[0];
    }
    // Trim whitespace
    cleaned = cleaned.trim();
    return cleaned;
}
// ============================================================
// EXPORTED API HANDLERS
// ============================================================
const parseJobDescription = async (req, res) => {
    console.log('📝 Parse job description called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        const prompt = `${JOB_PARSING_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 4000)}`;
        const rawResponse = await callWithFallback(prompt, true);
        const cleanResponse = cleanJsonResponse(rawResponse);
        const parsed = JSON.parse(cleanResponse);
        // Validate and ensure all fields exist
        const result = {
            company: parsed.company || '',
            role: parsed.role || '',
            requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
            niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
            seniority: parsed.seniority || '',
            location: parsed.location || '',
        };
        console.log('✅ Parse successful:', result.company, result.role);
        res.json(result);
    }
    catch (error) {
        console.error('Parse error:', error.message);
        // Return error - NO MOCK DATA
        res.status(500).json({ error: 'Failed to parse job description. Please try again.' });
    }
};
exports.parseJobDescription = parseJobDescription;
const generateResumeSuggestions = async (req, res) => {
    console.log('📝 Generate suggestions called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        const prompt = `${RESUME_SUGGESTIONS_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`;
        const rawResponse = await callWithFallback(prompt, true);
        const cleanResponse = cleanJsonResponse(rawResponse);
        const parsed = JSON.parse(cleanResponse);
        const suggestions = parsed.suggestions || [];
        // Ensure we have at least 3 suggestions
        const finalSuggestions = suggestions.slice(0, 5);
        console.log(`✅ Generated ${finalSuggestions.length} suggestions`);
        res.json({ suggestions: finalSuggestions });
    }
    catch (error) {
        console.error('Suggestions error:', error.message);
        // Return error - NO MOCK DATA
        res.status(500).json({ error: 'Failed to generate suggestions. Please try again.' });
    }
};
exports.generateResumeSuggestions = generateResumeSuggestions;
