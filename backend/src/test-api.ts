import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({
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
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

test();