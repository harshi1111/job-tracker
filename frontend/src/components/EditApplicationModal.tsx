import { useState, useEffect } from 'react';
import { updateApplication } from '../services/application.service';
import type { Application } from '../services/application.service';
import { ChevronDown, ChevronUp, Sparkles, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { generateResumeSuggestions } from '../services/ai.service';

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  application: Application | null;
}

export default function EditApplicationModal({ isOpen, onClose, onSuccess, application }: EditApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobDescriptionLink: '',
    notes: '',
    dateApplied: '',
    status: 'applied',
    salaryRange: '',
    // NEW FIELDS
    followUpDate: '',
    reminderNotes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        role: application.role,
        jobDescriptionLink: application.jobDescriptionLink || '',
        notes: application.notes || '',
        dateApplied: application.dateApplied.split('T')[0],
        status: application.status,
        salaryRange: application.salaryRange || '',
        // NEW FIELDS - load from application
        followUpDate: (application as any).followUpDate?.split('T')[0] || '',
        reminderNotes: (application as any).reminderNotes || '',
      });
      
      // Load existing suggestions or empty array
      const existingSuggestions = application.resumeSuggestions || [];
      const existingJobDescription = (application as any).jobDescription || '';
      const existingSkills = (application as any).skills || [];
      
      setSuggestions(existingSuggestions);
      setJobDescription(existingJobDescription);
      setSkills(existingSkills);
    }
  }, [application]);

  const handleGenerateSuggestions = async () => {
    if (!jobDescription) {
      setError('Please paste a job description to generate suggestions');
      return;
    }
    
    setLoadingSuggestions(true);
    setError('');
    
    try {
      const result = await generateResumeSuggestions(jobDescription);
      setSuggestions(result.suggestions || []);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCopySuggestion = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopySuccess(`suggestion-${index}`);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedData = {
        company: formData.company,
        role: formData.role,
        jobDescriptionLink: formData.jobDescriptionLink,
        notes: formData.notes,
        dateApplied: formData.dateApplied,
        status: formData.status,
        salaryRange: formData.salaryRange,
        skills: skills,
        resumeSuggestions: suggestions,
        jobDescription: jobDescription,
        // NEW FIELDS
        followUpDate: formData.followUpDate || null,
        reminderNotes: formData.reminderNotes || '',
      };
      await updateApplication(application!._id, updatedData);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col mx-2 sm:mx-0">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Application</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Date Applied</label>
                <input
                  type="date"
                  value={formData.dateApplied}
                  onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                >
                  <option value="applied">Applied</option>
                  <option value="phone-screen">Phone Screen</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Salary Range</label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                  placeholder="e.g., $120k - $150k"
                />
              </div>
              
              {/* NEW FIELDS - Follow-up Date and Reminder Notes */}
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Follow-up Date <span className="text-gray-400 text-xs">(when to follow up)</span>
                </label>
                <input
                  type="date"
                  value={formData.followUpDate || ''}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Reminder Notes
                </label>
                <textarea
                  value={formData.reminderNotes || ''}
                  onChange={(e) => setFormData({ ...formData, reminderNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white h-16 text-sm resize-none"
                  placeholder="e.g., Send thank you email, Follow up on interview decision..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Job Description Link</label>
                <input
                  type="url"
                  value={formData.jobDescriptionLink}
                  onChange={(e) => setFormData({ ...formData, jobDescriptionLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Job Description Text</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white h-24 text-sm resize-none"
                  placeholder="Paste job description here to generate AI suggestions"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white h-16 text-sm resize-none"
                  placeholder="Interview notes, follow-up tasks, etc..."
                />
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Extracted Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <button
                type="button"
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Resume Suggestions</span>
                  {suggestions.length > 0 && (
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                      {suggestions.length}
                    </span>
                  )}
                </div>
                {showAISuggestions ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>

              {showAISuggestions && (
                <div className="mt-3 space-y-3">
                  {/* Generate button - always visible */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateSuggestions}
                      disabled={loadingSuggestions}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1"
                    >
                      {loadingSuggestions ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {loadingSuggestions ? 'Generating...' : (suggestions.length > 0 ? 'Regenerate Suggestions' : 'Generate Suggestions')}
                    </button>
                  </div>

                  {/* Display suggestions if any */}
                  {suggestions.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-2 group">
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-gray-700 dark:text-gray-300 text-xs flex-1 leading-relaxed">{suggestion}</p>
                            <button
                              type="button"
                              onClick={() => handleCopySuggestion(suggestion, idx)}
                              className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-indigo-600 text-xs hover:bg-indigo-50 transition-all flex-shrink-0"
                            >
                              {copySuccess === `suggestion-${idx}` ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copySuccess === `suggestion-${idx}` ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-form"
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2 text-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}