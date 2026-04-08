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
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
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
      });
      // Load saved suggestions if they exist
      if ((application as any).resumeSuggestions) {
        setSuggestions((application as any).resumeSuggestions);
      }
      if ((application as any).jobDescription) {
        setJobDescription((application as any).jobDescription);
      }
    }
  }, [application]);

  const handleGenerateSuggestions = async () => {
    if (!jobDescription) {
      setError('No job description available. Please add one in notes or link.');
      return;
    }
    
    setLoadingSuggestions(true);
    setError('');
    
    try {
      const result = await generateResumeSuggestions(jobDescription);
      setSuggestions(result.suggestions || []);
      setShowAISuggestions(true);
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
      // Save suggestions along with form data
      const updatedData = {
        ...formData,
        resumeSuggestions: suggestions,
        jobDescription: jobDescription,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Application</h2>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Date Applied</label>
                <input
                  type="date"
                  value={formData.dateApplied}
                  onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  placeholder="e.g., $120k - $150k"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Job Description Link</label>
                <input
                  type="url"
                  value={formData.jobDescriptionLink}
                  onChange={(e) => setFormData({ ...formData, jobDescriptionLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                  Job Description Text (for AI suggestions)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white h-24 resize-none"
                  placeholder="Paste job description here to get AI resume suggestions..."
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white h-20 resize-none"
                  placeholder="Interview notes, follow-up tasks, etc..."
                />
              </div>
            </div>

            {/* AI Suggestions Collapsible Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                type="button"
                onClick={() => setShowAISuggestions(!showAISuggestions)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Resume Suggestions
                  </span>
                  {suggestions.length > 0 && (
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                      {suggestions.length} saved
                    </span>
                  )}
                </div>
                {showAISuggestions ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {showAISuggestions && (
                <div className="mt-3 space-y-3">
                  {suggestions.length === 0 && !loadingSuggestions && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        No AI suggestions yet. Generate suggestions based on the job description.
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateSuggestions}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all flex items-center gap-1 mx-auto"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generate Suggestions
                      </button>
                    </div>
                  )}

                  {loadingSuggestions && (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Generating AI suggestions...</p>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      {suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 group"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                              {suggestion}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCopySuggestion(suggestion, idx)}
                              className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all flex-shrink-0"
                            >
                              {copySuccess === `suggestion-${idx}` ? (
                                <>
                                  <CheckCircle className="w-3 h-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleGenerateSuggestions}
                        className="w-full text-center text-xs text-indigo-500 hover:text-indigo-600 py-2"
                      >
                        Regenerate Suggestions
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}