import { useState } from 'react';
import { parseJobDescription, generateResumeSuggestions } from '../services/ai.service';
import { createApplication } from '../services/application.service';
import { Loader2, Sparkles, AlertCircle, CheckCircle, Copy, ChevronLeft } from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddApplicationModal({ isOpen, onClose, onSuccess }: AddApplicationModalProps) {
  const [step, setStep] = useState<'paste' | 'form'>('paste');
  const [jobDescription, setJobDescription] = useState('');
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobDescriptionLink: '',
    notes: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'applied',
    salaryRange: '',
    skills: [] as string[]
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleParse = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }
    
    setParsing(true);
    setError('');
    
    try {
      const parsed = await parseJobDescription(jobDescription);
      const suggestionsResult = await generateResumeSuggestions(jobDescription);
      
      if (!suggestionsResult.suggestions || suggestionsResult.suggestions.length === 0) {
        setError('AI could not generate suggestions. Please try again.');
        setParsing(false);
        return;
      }
      
      setFormData({
        ...formData,
        company: parsed.company || '',
        role: parsed.role || '',
        skills: parsed.requiredSkills || [],
      });
      setSuggestions(suggestionsResult.suggestions || []);
      setStep('form');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to parse job description. Please try again.';
      setError(errorMessage);
      console.error('Parse error:', err);
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const applicationData = {
        ...formData,
        resumeSuggestions: suggestions,
        jobDescription: jobDescription,
        skills: formData.skills,
      };
      await createApplication(applicationData);
      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to save application';
      setError(errorMessage);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopySuggestion = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopySuccess(`suggestion-${index}`);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const resetForm = () => {
    setStep('paste');
    setJobDescription('');
    setFormData({
      company: '',
      role: '',
      jobDescriptionLink: '',
      notes: '',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied',
      salaryRange: '',
      skills: []
    });
    setSuggestions([]);
    setError('');
    setCopySuccess(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header - Fixed */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {step === 'form' && (
                <button
                  onClick={() => setStep('paste')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {step === 'paste' ? 'Add New Application' : 'Review & Save'}
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {step === 'paste' ? (
            <div>
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Paste a job description and AI will automatically extract company, role, skills, and generate tailored resume suggestions.
                </p>
              </div>
              
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
              />
            </div>
          ) : (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  AI successfully parsed this job description
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div className="col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Job Description Link</label>
                  <input
                    type="url"
                    value={formData.jobDescriptionLink}
                    onChange={(e) => setFormData({ ...formData, jobDescriptionLink: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0a0a0f] border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm"
                    placeholder="https://..."
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
                
                {formData.skills.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Extracted Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {suggestions.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">AI Resume Suggestions</label>
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
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium text-sm"
            >
              Cancel
            </button>
            {step === 'paste' ? (
              <button
                onClick={handleParse}
                disabled={parsing}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2 text-sm"
              >
                {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {parsing ? 'Parsing...' : 'Parse with AI'}
              </button>
            ) : (
              <button
                type="submit"
                form="application-form"
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2 text-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}