import { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
