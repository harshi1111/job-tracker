import { Request, Response } from 'express';
import Resume from '../models/Resume';
import { AuthRequest } from '../middleware/auth';

// For now, store files as base64 in MongoDB (simple, no external service)
// Later you can switch to Cloudinary for better performance

export const uploadResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Resume title is required' });
    }

    // Check existing resumes count (max 6)
    const existingCount = await Resume.countDocuments({ userId });
    if (existingCount >= 6) {
      return res.status(400).json({ error: 'Maximum 6 resumes allowed. Delete one first.' });
    }

    // Convert file to base64 for storage (simple approach)
    const base64Data = file.buffer.toString('base64');
    const fileUrl = `data:${file.mimetype};base64,${base64Data}`;

    const resume = await Resume.create({
      userId,
      title: title.trim(),
      fileName: file.originalname,
      fileUrl,
      fileSize: file.size,
      fileType: file.mimetype,
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        title: resume.title,
        fileName: resume.fileName,
        fileSize: resume.fileSize,
        fileType: resume.fileType,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
};

export const getUserResumes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title fileName fileSize fileType createdAt');

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

export const updateResumeTitle = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const resumeId = req.params.id;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    resume.title = title.trim();
    await resume.save();

    res.json({ message: 'Resume title updated', resume });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume title' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const resumeId = req.params.id;

    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};