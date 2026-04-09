"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumeSuggestionsStream = exports.parseJobDescriptionStream = exports.generateResumeSuggestions = exports.parseJobDescription = void 0;
exports.resetProviderIndices = resetProviderIndices;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const generative_ai_1 = require("@google/generative-ai");
const openai_1 = __importDefault(require("openai"));
// ============================================================
// MULTI-KEY PROVIDER INITIALIZATION WITH ROTATION
// ============================================================
// Get all Groq keys from env (supports up to 3 keys)
const groqKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY,
].filter((key) => key !== undefined && key !== null && key.trim() !== '');
// Get all Gemini keys from env (supports up to 3 keys)
const geminiKeys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY,
].filter((key) => key !== undefined && key !== null && key.trim() !== '');
// Get all OpenRouter keys from env (supports up to 3 keys)
const openrouterKeys = [
    process.env.OPENROUTER_API_KEY_1,
    process.env.OPENROUTER_API_KEY_2,
    process.env.OPENROUTER_API_KEY_3,
    process.env.OPENROUTER_API_KEY,
].filter((key) => key !== undefined && key !== null && key.trim() !== '');
const groqProviders = groqKeys.map((key, index) => ({
    name: `Groq-${index + 1}`,
    client: new groq_sdk_1.default({ apiKey: key }),
    key: key
}));
const geminiProviders = geminiKeys.map((key, index) => ({
    name: `Gemini-${index + 1}`,
    client: new generative_ai_1.GoogleGenerativeAI(key),
    key: key
}));
const openrouterProviders = openrouterKeys.map((key, index) => ({
    name: `OpenRouter-${index + 1}`,
    client: new openai_1.default({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: key,
    }),
    key: key
}));
// Track current key indices for round-robin rotation
let currentGroqIndex = 0;
let currentGeminiIndex = 0;
let currentOpenrouterIndex = 0;
// Helper function to get next provider (round-robin)
function getNextGroqProvider() {
    if (groqProviders.length === 0)
        return null;
    const provider = groqProviders[currentGroqIndex % groqProviders.length];
    currentGroqIndex = (currentGroqIndex + 1) % groqProviders.length;
    return provider;
}
function getNextGeminiProvider() {
    if (geminiProviders.length === 0)
        return null;
    const provider = geminiProviders[currentGeminiIndex % geminiProviders.length];
    currentGeminiIndex = (currentGeminiIndex + 1) % geminiProviders.length;
    return provider;
}
function getNextOpenRouterProvider() {
    if (openrouterProviders.length === 0)
        return null;
    const provider = openrouterProviders[currentOpenrouterIndex % openrouterProviders.length];
    currentOpenrouterIndex = (currentOpenrouterIndex + 1) % openrouterProviders.length;
    return provider;
}
// Reset all indices (useful for testing)
function resetProviderIndices() {
    currentGroqIndex = 0;
    currentGeminiIndex = 0;
    currentOpenrouterIndex = 0;
    console.log('🔄 Provider indices reset');
}
console.log(`📊 Loaded ${groqProviders.length} Groq keys, ${geminiProviders.length} Gemini keys, ${openrouterProviders.length} OpenRouter keys`);
// ============================================================
// EXPERT PROMPTS
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
// ============================================================
// HELPER FUNCTIONS
// ============================================================
function cleanJsonResponse(content) {
    let cleaned = content;
    if (cleaned.includes('```json')) {
        cleaned = cleaned.split('```json')[1].split('```')[0];
    }
    else if (cleaned.includes('```')) {
        cleaned = cleaned.split('```')[1].split('```')[0];
    }
    cleaned = cleaned.trim();
    return cleaned;
}
// ============================================================
// NON-STREAMING API HANDLERS (with multi-key rotation)
// ============================================================
const parseJobDescription = async (req, res) => {
    console.log('📝 Parse job description called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        const prompt = `${JOB_PARSING_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 4000)}`;
        const errors = [];
        // Try all Groq keys first
        for (let i = 0; i < groqProviders.length * 2; i++) {
            const provider = getNextGroqProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for parsing...`);
                const response = await provider.client.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    const parsed = JSON.parse(cleanResponse);
                    const result = {
                        company: parsed.company || '',
                        role: parsed.role || '',
                        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
                        niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
                        seniority: parsed.seniority || '',
                        location: parsed.location || '',
                    };
                    console.log(`✅ ${provider.name} parse successful:`, result.company, result.role);
                    res.json(result);
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all Gemini keys
        for (let i = 0; i < geminiProviders.length * 2; i++) {
            const provider = getNextGeminiProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for parsing...`);
                const genAI = provider.client;
                const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const result = await geminiModel.generateContent(prompt);
                let text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    text = jsonMatch[0];
                const cleanResponse = cleanJsonResponse(text);
                const parsed = JSON.parse(cleanResponse);
                const result_data = {
                    company: parsed.company || '',
                    role: parsed.role || '',
                    requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
                    niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
                    seniority: parsed.seniority || '',
                    location: parsed.location || '',
                };
                console.log(`✅ ${provider.name} parse successful:`, result_data.company, result_data.role);
                res.json(result_data);
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all OpenRouter keys
        for (let i = 0; i < openrouterProviders.length * 2; i++) {
            const provider = getNextOpenRouterProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for parsing...`);
                const response = await provider.client.chat.completions.create({
                    model: 'openai/gpt-oss-20b:free',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    const parsed = JSON.parse(cleanResponse);
                    const result = {
                        company: parsed.company || '',
                        role: parsed.role || '',
                        requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
                        niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills) ? parsed.niceToHaveSkills : [],
                        seniority: parsed.seniority || '',
                        location: parsed.location || '',
                    };
                    console.log(`✅ ${provider.name} parse successful:`, result.company, result.role);
                    res.json(result);
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        console.error('All providers failed:', errors);
        res.status(500).json({ error: 'Failed to parse job description. Please try again.' });
    }
    catch (error) {
        console.error('Parse error:', error.message);
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
        const errors = [];
        // Try all Groq keys first
        for (let i = 0; i < groqProviders.length * 2; i++) {
            const provider = getNextGroqProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for suggestions...`);
                const response = await provider.client.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    const parsed = JSON.parse(cleanResponse);
                    const suggestions = parsed.suggestions || [];
                    const finalSuggestions = suggestions.slice(0, 5);
                    console.log(`✅ ${provider.name} generated ${finalSuggestions.length} suggestions`);
                    res.json({ suggestions: finalSuggestions });
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all Gemini keys
        for (let i = 0; i < geminiProviders.length * 2; i++) {
            const provider = getNextGeminiProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for suggestions...`);
                const genAI = provider.client;
                const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const result = await geminiModel.generateContent(prompt);
                let text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    text = jsonMatch[0];
                const cleanResponse = cleanJsonResponse(text);
                const parsed = JSON.parse(cleanResponse);
                const suggestions = parsed.suggestions || [];
                const finalSuggestions = suggestions.slice(0, 5);
                console.log(`✅ ${provider.name} generated ${finalSuggestions.length} suggestions`);
                res.json({ suggestions: finalSuggestions });
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all OpenRouter keys
        for (let i = 0; i < openrouterProviders.length * 2; i++) {
            const provider = getNextOpenRouterProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} for suggestions...`);
                const response = await provider.client.chat.completions.create({
                    model: 'openai/gpt-oss-20b:free',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    const parsed = JSON.parse(cleanResponse);
                    const suggestions = parsed.suggestions || [];
                    const finalSuggestions = suggestions.slice(0, 5);
                    console.log(`✅ ${provider.name} generated ${finalSuggestions.length} suggestions`);
                    res.json({ suggestions: finalSuggestions });
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        console.error('All providers failed for suggestions:', errors);
        res.status(500).json({ error: 'Failed to generate suggestions. Please try again.' });
    }
    catch (error) {
        console.error('Suggestions error:', error.message);
        res.status(500).json({ error: 'Failed to generate suggestions. Please try again.' });
    }
};
exports.generateResumeSuggestions = generateResumeSuggestions;
// ============================================================
// STREAMING API HANDLERS (with multi-key rotation)
// ============================================================
const parseJobDescriptionStream = async (req, res) => {
    console.log('📡 Streaming parse job description called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const prompt = `${JOB_PARSING_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 4000)}`;
        let fullResponse = '';
        // Try all Groq keys for streaming
        for (let i = 0; i < groqProviders.length * 2; i++) {
            const provider = getNextGroqProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} streaming...`);
                const stream = await provider.client.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    stream: true,
                });
                fullResponse = '';
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        fullResponse += content;
                        res.write(`data: ${JSON.stringify({ chunk: content, full: fullResponse })}\n\n`);
                    }
                }
                console.log(`✅ ${provider.name} streaming succeeded`);
                res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                res.end();
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} streaming failed:`, error.message);
            }
        }
        // Fallback to Gemini (non-streaming) with key rotation
        for (let i = 0; i < geminiProviders.length * 2; i++) {
            const provider = getNextGeminiProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} fallback...`);
                const genAI = provider.client;
                const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const result = await geminiModel.generateContent(prompt);
                let text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    text = jsonMatch[0];
                fullResponse = text;
                res.write(`data: ${JSON.stringify({ chunk: fullResponse, full: fullResponse })}\n\n`);
                res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                res.end();
                console.log(`✅ ${provider.name} fallback succeeded`);
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} fallback failed:`, error.message);
            }
        }
        // Fallback to OpenRouter with key rotation
        for (let i = 0; i < openrouterProviders.length * 2; i++) {
            const provider = getNextOpenRouterProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} OpenRouter fallback...`);
                const response = await provider.client.chat.completions.create({
                    model: 'openai/gpt-oss-20b:free',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                });
                fullResponse = response.choices[0]?.message?.content || '';
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    fullResponse = jsonMatch[0];
                res.write(`data: ${JSON.stringify({ chunk: fullResponse, full: fullResponse })}\n\n`);
                res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                res.end();
                console.log(`✅ ${provider.name} OpenRouter fallback succeeded`);
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} OpenRouter fallback failed:`, error.message);
            }
        }
        console.error('All streaming providers and fallbacks failed');
        res.write(`data: ${JSON.stringify({ error: 'All AI providers failed. Please try again later.' })}\n\n`);
        res.end();
    }
    catch (error) {
        console.error('Stream parse error:', error.message);
        res.write(`data: ${JSON.stringify({ error: 'Failed to parse job description. Please try again.' })}\n\n`);
        res.end();
    }
};
exports.parseJobDescriptionStream = parseJobDescriptionStream;
const generateResumeSuggestionsStream = async (req, res) => {
    console.log('📡 Streaming resume suggestions called');
    try {
        const { jobDescription } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const prompt = `${RESUME_SUGGESTIONS_PROMPT}\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`;
        let fullResponse = '';
        // Try all Groq keys for streaming suggestions
        for (let i = 0; i < groqProviders.length * 2; i++) {
            const provider = getNextGroqProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} streaming for suggestions...`);
                const stream = await provider.client.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    stream: true,
                });
                fullResponse = '';
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        fullResponse += content;
                        res.write(`data: ${JSON.stringify({ chunk: content, full: fullResponse })}\n\n`);
                    }
                }
                console.log(`✅ ${provider.name} streaming suggestions succeeded`);
                res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                res.end();
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} streaming suggestions failed:`, error.message);
            }
        }
        // Fallback to non-streaming with key rotation for suggestions
        const errors = [];
        // Try all Groq keys non-streaming
        for (let i = 0; i < groqProviders.length * 2; i++) {
            const provider = getNextGroqProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} non-streaming for suggestions...`);
                const response = await provider.client.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    fullResponse = cleanResponse;
                    res.write(`data: ${JSON.stringify({ chunk: fullResponse, full: fullResponse })}\n\n`);
                    res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                    res.end();
                    console.log(`✅ ${provider.name} non-streaming suggestions succeeded`);
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all Gemini keys
        for (let i = 0; i < geminiProviders.length * 2; i++) {
            const provider = getNextGeminiProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} Gemini for suggestions...`);
                const genAI = provider.client;
                const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const result = await geminiModel.generateContent(prompt);
                let text = result.response.text();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch)
                    text = jsonMatch[0];
                const cleanResponse = cleanJsonResponse(text);
                fullResponse = cleanResponse;
                res.write(`data: ${JSON.stringify({ chunk: fullResponse, full: fullResponse })}\n\n`);
                res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                res.end();
                console.log(`✅ ${provider.name} Gemini suggestions succeeded`);
                return;
            }
            catch (error) {
                console.error(`❌ ${provider.name} Gemini failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        // Try all OpenRouter keys
        for (let i = 0; i < openrouterProviders.length * 2; i++) {
            const provider = getNextOpenRouterProvider();
            if (!provider)
                break;
            try {
                console.log(`🔄 Trying ${provider.name} OpenRouter for suggestions...`);
                const response = await provider.client.chat.completions.create({
                    model: 'openai/gpt-oss-20b:free',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: { type: 'json_object' },
                });
                const content = response.choices[0]?.message?.content || '';
                if (content) {
                    const cleanResponse = cleanJsonResponse(content);
                    fullResponse = cleanResponse;
                    res.write(`data: ${JSON.stringify({ chunk: fullResponse, full: fullResponse })}\n\n`);
                    res.write(`data: ${JSON.stringify({ done: true, full: fullResponse })}\n\n`);
                    res.end();
                    console.log(`✅ ${provider.name} OpenRouter suggestions succeeded`);
                    return;
                }
            }
            catch (error) {
                console.error(`❌ ${provider.name} OpenRouter failed:`, error.message);
                errors.push(`${provider.name}: ${error.message}`);
            }
        }
        console.error('All suggestions providers failed:', errors);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate suggestions. Please try again.' })}\n\n`);
        res.end();
    }
    catch (error) {
        console.error('Stream suggestions error:', error.message);
        res.write(`data: ${JSON.stringify({ error: 'Failed to generate suggestions. Please try again.' })}\n\n`);
        res.end();
    }
};
exports.generateResumeSuggestionsStream = generateResumeSuggestionsStream;
