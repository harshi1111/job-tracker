import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testOpenRouter() {
  console.log('\n🔵 Testing OpenRouter...');
  try {
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    
    const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b:free',
      messages: [{ role: 'user', content: 'Say "OpenRouter works!"' }],
    });
    
    console.log('✅ OpenRouter:', response.choices[0]?.message?.content);
    return true;
  } catch (error: any) {
    console.log('❌ OpenRouter failed:', error.message);
    return false;
  }
}

async function testGroq() {
  console.log('\n🟢 Testing Groq...');
  try {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say "Groq works!"' }],
    });
    
    console.log('✅ Groq:', response.choices[0]?.message?.content);
    return true;
  } catch (error: any) {
    console.log('❌ Groq failed:', error.message);
    return false;
  }
}

async function testGemini() {
  console.log('\n🟡 Testing Gemini...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    const result = await model.generateContent('Say "Gemini works!"');
    
    console.log('✅ Gemini:', result.response.text());
    return true;
  } catch (error: any) {
    console.log('❌ Gemini failed:', error.message);
    return false;
  }
}

async function testAll() {
  console.log('🚀 Testing all API keys...\n');
  
  const results = {
    openrouter: await testOpenRouter(),
    groq: await testGroq(),
    gemini: await testGemini(),
  };
  
  console.log('\n📊 SUMMARY:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`OpenRouter: ${results.openrouter ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Groq:       ${results.groq ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Gemini:     ${results.gemini ? '✅ WORKING' : '❌ FAILED'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const workingCount = Object.values(results).filter(Boolean).length;
  console.log(`\n💡 ${workingCount} out of 3 providers working`);
  
  if (workingCount === 0) {
    console.log('\n⚠️ No providers working! Please check your API keys in .env file');
  }
}

testAll();