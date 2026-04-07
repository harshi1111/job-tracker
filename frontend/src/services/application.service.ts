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
}

export const getApplications = async () => {
  const response = await api.get('/applications');
  return response.data;
};

export const createApplication = async (data: CreateApplicationData) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const updateApplication = async (id: string, data: Partial<CreateApplicationData>) => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};