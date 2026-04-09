import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  roleName: string;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  companyName, 
  roleName 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal - Centered */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[380px] max-w-[90vw]"
          >
            <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Application</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Are you sure you want to delete this application?
                </p>
                <div className="bg-gray-50 dark:bg-[#0a0a0f] rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{roleName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{companyName}</p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                  This action cannot be undone.
                </p>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}