import dotenv from 'dotenv';
dotenv.config();

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Found' : '❌ Not found');
console.log('OPENAI_BASE_URL:', process.env.OPENAI_BASE_URL);