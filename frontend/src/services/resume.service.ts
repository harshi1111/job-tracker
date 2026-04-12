import api from './api';

export interface Resume {
  _id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

export const uploadResume = async (file: File, title: string): Promise<Resume> => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('title', title);

  const response = await api.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.resume;
};

export const getUserResumes = async (): Promise<Resume[]> => {
  const response = await api.get('/resumes');
  return response.data.resumes;
};

export const updateResumeTitle = async (id: string, title: string): Promise<void> => {
  await api.put(`/resumes/${id}`, { title });
};

export const deleteResume = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};