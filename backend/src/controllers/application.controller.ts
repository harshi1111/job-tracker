import { Request, Response } from 'express';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth';

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await Application.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.create({
      ...req.body,
      userId: req.userId,
      updatedAt: new Date()
    });
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const application = await Application.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
};