import { useState } from 'react';
import { parseJobDescription, generateResumeSuggestions } from '../services/ai.service';
import { createApplication } from '../services/application.service';


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
      
      setFormData({
        ...formData,
        company: parsed.company,
        role: parsed.role,
        skills: parsed.requiredSkills,
      });
      setSuggestions(suggestionsResult.suggestions || []);
      setStep('form');
    } catch (err) {
      setError('Failed to parse job description. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await createApplication(formData);
      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      setError('Failed to save application');
    } finally {
      setSaving(false);
    }
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Add Application</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 'paste' ? (
            <div>
              <p className="text-gray-300 mb-3">Paste the job description below. AI will extract company, role, and skills.</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full h-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
                <button
                  onClick={handleParse}
                  disabled={parsing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {parsing ? 'Parsing...' : 'Parse with AI'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Company *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Role *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Date Applied</label>
                  <input
                    type="date"
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="applied">Applied</option>
                    <option value="phone-screen">Phone Screen</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-300 text-sm mb-1">Job Description Link</label>
                  <input
                    type="url"
                    value={formData.jobDescriptionLink}
                    onChange={(e) => setFormData({ ...formData, jobDescriptionLink: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="https://..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-300 text-sm mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-20"
                    placeholder="Interview notes, etc..."
                  />
                </div>
                
                {suggestions.length > 0 && (
                  <div className="col-span-2">
                    <label className="block text-gray-300 text-sm mb-1">AI Resume Suggestions</label>
                    <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                      {suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-2">
                          <p className="text-gray-300 text-sm flex-1">{suggestion}</p>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(suggestion)}
                            className="text-blue-400 text-xs hover:text-blue-300"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep('paste')}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}