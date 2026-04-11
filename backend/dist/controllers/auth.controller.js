"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySecurityAnswer = exports.initiatePasswordReset = exports.setSecurityQuestion = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Check if user exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await User_1.default.create({
            email,
            password: hashedPassword,
            name
        });
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Check password
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};
exports.login = login;
// ============================================================
// FORGOT PASSWORD - SECURITY QUESTION METHOD
// ============================================================
const setSecurityQuestion = async (req, res) => {
    try {
        const { securityQuestion, securityAnswer } = req.body;
        const userId = req.userId;
        if (!securityQuestion || !securityAnswer) {
            return res.status(400).json({ error: 'Security question and answer are required' });
        }
        // Hash the security answer
        const hashedAnswer = await bcryptjs_1.default.hash(securityAnswer.toLowerCase().trim(), 10);
        await User_1.default.findByIdAndUpdate(userId, {
            securityQuestion,
            securityAnswer: hashedAnswer
        });
        res.json({ message: 'Security question set successfully' });
    }
    catch (error) {
        console.error('Set security question error:', error);
        res.status(500).json({ error: 'Failed to set security question' });
    }
};
exports.setSecurityQuestion = setSecurityQuestion;
const initiatePasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'No account found with this email' });
        }
        if (!user.securityQuestion) {
            return res.status(400).json({ error: 'Security question not set. Please contact support.' });
        }
        // Return the security question (not the answer!)
        res.json({
            hasSecurityQuestion: true,
            securityQuestion: user.securityQuestion,
            email: user.email
        });
    }
    catch (error) {
        console.error('Initiate reset error:', error);
        res.status(500).json({ error: 'Failed to initiate password reset' });
    }
};
exports.initiatePasswordReset = initiatePasswordReset;
const verifySecurityAnswer = async (req, res) => {
    try {
        const { email, securityAnswer, newPassword } = req.body;
        if (!email || !securityAnswer || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if security question exists
        if (!user.securityQuestion || !user.securityAnswer) {
            return res.status(400).json({ error: 'Security question not set for this account' });
        }
        // Verify security answer
        const isValid = await bcryptjs_1.default.compare(securityAnswer.toLowerCase().trim(), user.securityAnswer);
        if (!isValid) {
            return res.status(401).json({ error: 'Incorrect security answer' });
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Verify answer error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};
exports.verifySecurityAnswer = verifySecurityAnswer;
