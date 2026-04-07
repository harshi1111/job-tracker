"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplications = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const getApplications = async (req, res) => {
    try {
        const applications = await Application_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(applications);
    }
    catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
};
exports.getApplications = getApplications;
const createApplication = async (req, res) => {
    try {
        const application = await Application_1.default.create({
            ...req.body,
            userId: req.userId,
            updatedAt: new Date()
        });
        res.status(201).json(application);
    }
    catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ error: 'Failed to create application' });
    }
};
exports.createApplication = createApplication;
const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application_1.default.findOneAndUpdate({ _id: id, userId: req.userId }, { ...req.body, updatedAt: new Date() }, { new: true });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    }
    catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ error: 'Failed to update application' });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await Application_1.default.findOneAndDelete({ _id: id, userId: req.userId });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json({ message: 'Application deleted successfully' });
    }
    catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ error: 'Failed to delete application' });
    }
};
exports.deleteApplication = deleteApplication;
