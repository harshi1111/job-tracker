import api from './api';

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

// Regular API calls (non-streaming)
export const parseJobDescription = async (jobDescription: string): Promise<ParsedJobData> => {
  const response = await api.post('/ai/parse-job', { jobDescription });
  return response.data;
};

export const generateResumeSuggestions = async (jobDescription: string): Promise<{ suggestions: string[] }> => {
  const response = await api.post('/ai/resume-suggestions', { jobDescription });
  return response.data;
};

// STREAMING API CALLS 

export const parseJobDescriptionStream = async (
  jobDescription: string,
  onChunk: (chunk: string, full: string) => void,
  onComplete: (full: string) => void,
  onError: (error: string) => void
) => {
  try {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    
    const response = await fetch(`${API_URL}/ai/parse-job-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jobDescription })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.chunk) {
              onChunk(data.chunk, data.full);
            }
            if (data.done) {
              onComplete(data.full);
              return;
            }
          } catch (e) {
            
          }
        }
      }
    }
  } catch (error: any) {
    onError(error.message || 'Failed to parse job description');
  }
};

export const generateResumeSuggestionsStream = async (
  jobDescription: string,
  onChunk: (chunk: string, full: string) => void,
  onComplete: (full: string) => void,
  onError: (error: string) => void
) => {
  try {
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    
    const response = await fetch(`${API_URL}/ai/resume-suggestions-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jobDescription })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.chunk) {
              onChunk(data.chunk, data.full);
            }
            if (data.done) {
              onComplete(data.full);
              return;
            }
          } catch (e) {
            
          }
        }
      }
    }
  } catch (error: any) {
    onError(error.message || 'Failed to generate suggestions');
  }
};