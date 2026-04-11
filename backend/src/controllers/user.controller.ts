import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔐 Update password request received');
    console.log('userId:', req.userId);
    console.log('Request body:', req.body);

    const { newPassword } = req.body;
    const userId = req.userId;

    if (!newPassword || newPassword.trim() === '') {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Get user
    const user = await User.findById(userId);
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('New password hashed');

    // Update password
    user.password = hashedPassword;
    await user.save();
    console.log('✅ Password updated successfully');

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    
    const Application = require('../models/Application').default;
    await Application.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};