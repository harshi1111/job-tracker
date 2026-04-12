import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, securityQuestion, securityAnswer } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data object
    const userData: any = {
      email,
      password: hashedPassword,
      name,
    };

    // Add security question if provided
    if (securityQuestion && securityAnswer) {
      const hashedSecurityAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);
      userData.securityQuestion = securityQuestion;
      userData.securityAnswer = hashedSecurityAnswer;
    }

    // Create user
    const user = await User.create(userData);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// ============================================================
// FORGOT PASSWORD - SECURITY QUESTION METHOD
// ============================================================

export const setSecurityQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { securityQuestion, securityAnswer } = req.body;
    const userId = req.userId;

    if (!securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Security question and answer are required' });
    }

    // Hash the security answer
    const hashedAnswer = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);

    await User.findByIdAndUpdate(userId, {
      securityQuestion,
      securityAnswer: hashedAnswer
    });

    res.json({ message: 'Security question set successfully' });
  } catch (error) {
    console.error('Set security question error:', error);
    res.status(500).json({ error: 'Failed to set security question' });
  }
};

export const initiatePasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    if (!user.securityQuestion) {
      return res.status(400).json({ error: 'Security question not set. Please set one in your profile settings.' });
    }

    // Return the security question (not the answer!)
    res.json({
      hasSecurityQuestion: true,
      securityQuestion: user.securityQuestion,
      email: user.email
    });
  } catch (error) {
    console.error('Initiate reset error:', error);
    res.status(500).json({ error: 'Failed to initiate password reset' });
  }
};

export const verifySecurityAnswer = async (req: Request, res: Response) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if security question exists
    if (!user.securityQuestion || !user.securityAnswer) {
      return res.status(400).json({ error: 'Security question not set for this account' });
    }

    // Verify security answer
    const isValid = await bcrypt.compare(securityAnswer.toLowerCase().trim(), user.securityAnswer);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect security answer' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Verify answer error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};