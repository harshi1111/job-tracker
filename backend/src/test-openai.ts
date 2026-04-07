import dotenv from 'dotenv';
dotenv.config();

import { parseJobDescription } from './services/openai.service';

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
    const result = await parseJobDescription(testJD);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();