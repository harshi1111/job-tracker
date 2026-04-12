import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, HelpCircle, Mail, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface FeedbackWidgetProps {
  theme?: 'light' | 'dark';
}

export default function FeedbackWidget({ theme = 'dark' }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'faq'>('feedback');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const faqs = [
    {
      question: "How do I add a job application?",
      answer: "Click the '+ Add Application' button on your dashboard. Fill in the job details or paste a job description URL for AI parsing."
    },
    {
      question: "How does the AI resume coach work?",
      answer: "After adding a job, click 'Get AI Suggestions' on the application card. The AI will analyze the job description and generate tailored resume bullet points."
    },
    {
      question: "Can I set a security question for password reset?",
      answer: "Yes! Go to Profile → 'Set Security Question'. Choose a question and answer. This will allow you to reset your password if you forget it."
    },
    {
      question: "How do I export my data?",
      answer: "On your dashboard, click the 'Export CSV' button. This will download all your applications as a CSV file."
    },
    {
      question: "Is my data backed up?",
      answer: "Yes, all your data is stored securely in MongoDB Atlas. You can also manually export your data anytime using the Export feature."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      setError('Please fill in both fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Send feedback to your backend (you can create an endpoint later)
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Optional: send to your email via backend API
      // await api.post('/feedback', { email, message });
      
      setSubmitted(true);
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError('Failed to send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const bgColor = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const inputBg = theme === 'dark' ? 'bg-[#0a0a0f]' : 'bg-gray-50';

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg ${bgColor} ${borderColor} border rounded-2xl shadow-2xl overflow-hidden`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-5 border-b ${borderColor}`}>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" />
                  <h2 className={`text-xl font-bold ${textColor}`}>Help & Feedback</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${textColor}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'feedback'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : `${subTextColor} hover:text-gray-700 dark:hover:text-gray-300`
                  }`}
                >
                  Send Feedback
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'faq'
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : `${subTextColor} hover:text-gray-700 dark:hover:text-gray-300`
                  }`}
                >
                  FAQ
                </button>
              </div>

              {/* Content */}
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {activeTab === 'feedback' ? (
                  <div>
                    {submitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className={`${textColor} font-medium`}>Thank you for your feedback!</p>
                        <p className={`${subTextColor} text-sm mt-1`}>We appreciate your input.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                            Your Email
                          </label>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${subTextColor}`} />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                            Message / Feedback
                          </label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none`}
                            placeholder="Tell us what you think, report a bug, or suggest a feature..."
                            required
                          />
                        </div>

                        {error && (
                          <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {submitting ? 'Sending...' : 'Send Feedback'}
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border ${borderColor} ${inputBg}`}
                      >
                        <h3 className={`font-semibold ${textColor} mb-2`}>
                          {faq.question}
                        </h3>
                        <p className={`text-sm ${subTextColor}`}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    ))}
                    
                    <div className={`text-center pt-4 ${subTextColor}`}>
                      <p className="text-sm">Need more help?</p>
                      <a 
                        href="mailto:support@pathgrid.com" 
                        className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
                      >
                        Contact pathgrid@gmail.com
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}