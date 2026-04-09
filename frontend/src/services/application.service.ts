import api from './api';

export interface Application {
  _id: string;
  company: string;
  role: string;
  jobDescriptionLink?: string;
  notes?: string;
  dateApplied: string;
  status: 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected';
  salaryRange?: string;
  skills?: string[];
  resumeSuggestions?: string[];
  jobDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  company: string;
  role: string;
  jobDescriptionLink?: string;
  notes?: string;
  dateApplied?: string;
  status?: string;
  salaryRange?: string;
  skills?: string[];
  resumeSuggestions?: string[];
  jobDescription?: string;
}

export const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

export const createApplication = async (data: CreateApplicationData) => {
  // EXPLICITLY build the payload to ensure all fields are sent
  const payload = {
    company: data.company,
    role: data.role,
    jobDescriptionLink: data.jobDescriptionLink || '',
    notes: data.notes || '',
    dateApplied: data.dateApplied,
    status: data.status || 'applied',
    salaryRange: data.salaryRange || '',
    skills: data.skills || [],
    resumeSuggestions: data.resumeSuggestions || [],
    jobDescription: data.jobDescription || ''
  };
  
  console.log('📤 Sending payload:', {
    company: payload.company,
    role: payload.role,
    resumeSuggestionsCount: payload.resumeSuggestions.length,
    jobDescriptionLength: payload.jobDescription.length
  });
  
  const response = await api.post('/applications', payload);
  return response.data;
};

export const updateApplication = async (id: string, data: Partial<CreateApplicationData>) => {
  const payload = {
    company: data.company,
    role: data.role,
    jobDescriptionLink: data.jobDescriptionLink || '',
    notes: data.notes || '',
    dateApplied: data.dateApplied,
    status: data.status,
    salaryRange: data.salaryRange || '',
    skills: data.skills || [],
    resumeSuggestions: data.resumeSuggestions || [],
    jobDescription: data.jobDescription || ''
  };
  
  console.log('📤 Updating payload:', { id, resumeSuggestionsCount: payload.resumeSuggestions.length });
  
  const response = await api.put(`/applications/${id}`, payload);
  return response.data;
};

export const deleteApplication = async (id: string) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};