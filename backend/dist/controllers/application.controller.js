"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.createApplication = exports.getApplications = void 0;
console.log('🔥 APPLICATION CONTROLLER LOADED - VERSION WITH RESUME SUGGESTIONS');
const Application_1 = __importDefault(require("../models/Application"));
const getApplications = async (req, res) => {
    try {
        const applications = await Application_1.default.find({ userId: req.userId }).sort({ createdAt: -1 });
        console.log(`📋 Returning ${applications.length} applications`);
        if (applications.length > 0) {
            console.log('📊 Sample app:', {
                company: applications[0].company,
                hasResumeSuggestions: !!applications[0].resumeSuggestions,
                resumeSuggestionsCount: applications[0].resumeSuggestions?.length || 0,
            });
        }
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
        console.log('🔥🔥🔥 CREATE APPLICATION CALLED 🔥🔥🔥');
        console.log('📥 RAW BODY received:', {
            company: req.body.company,
            role: req.body.role,
            hasResumeSuggestions: !!req.body.resumeSuggestions,
            resumeSuggestionsLength: req.body.resumeSuggestions?.length,
            hasJobDescription: !!req.body.jobDescription,
            jobDescriptionLength: req.body.jobDescription?.length
        });
        const applicationData = {
            company: req.body.company,
            role: req.body.role,
            jobDescriptionLink: req.body.jobDescriptionLink,
            notes: req.body.notes,
            dateApplied: req.body.dateApplied,
            status: req.body.status,
            salaryRange: req.body.salaryRange,
            skills: req.body.skills || [],
            resumeSuggestions: req.body.resumeSuggestions || [],
            jobDescription: req.body.jobDescription || '',
            userId: req.userId,
            updatedAt: new Date()
        };
        console.log('✅ Creating app with:', {
            company: applicationData.company,
            resumeSuggestionsCount: applicationData.resumeSuggestions.length,
            jobDescriptionLength: applicationData.jobDescription.length
        });
        const application = await Application_1.default.create(applicationData);
        console.log('✅ Application saved successfully:', application._id);
        res.status(201).json(application);
    }
    catch (error) {
        console.error('❌ Create application ERROR:', error.message);
        console.error('❌ Full error details:', error);
        res.status(500).json({ error: `Failed to create application: ${error.message}` });
    }
};
exports.createApplication = createApplication;
const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            company: req.body.company,
            role: req.body.role,
            jobDescriptionLink: req.body.jobDescriptionLink,
            notes: req.body.notes,
            dateApplied: req.body.dateApplied,
            status: req.body.status,
            salaryRange: req.body.salaryRange,
            skills: req.body.skills || [],
            resumeSuggestions: req.body.resumeSuggestions || [],
            jobDescription: req.body.jobDescription || '',
            updatedAt: new Date()
        };
        console.log('✏️ Updating:', { id, company: updateData.company, suggestionsCount: updateData.resumeSuggestions.length });
        const application = await Application_1.default.findOneAndUpdate({ _id: id, userId: req.userId }, updateData, { new: true });
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
