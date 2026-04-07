import api from './api';

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export const parseJobDescription = async (jobDescription: string): Promise<ParsedJobData> => {
  console.log('Calling parse-job API...');
  const response = await api.post('/ai/parse-job', { jobDescription });
  console.log('Parse response:', response.data);
  return response.data;
};

export const generateResumeSuggestions = async (jobDescription: string): Promise<{ suggestions: string[] }> => {
  console.log('Calling resume-suggestions API...');
  const response = await api.post('/ai/resume-suggestions', { jobDescription });
  console.log('Suggestions response:', response.data);
  return response.data;
};