import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddTransactionModal from './components/AddTransactionModal';
import ReceiptScanner from './components/ReceiptScanner';
import { Plus, ScanLine } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function App() {
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <Dashboard />
      </main>
      
      <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4">
        <button
          onClick={() => setScannerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          aria-label="Scan Receipt"
        >
          <ScanLine className="h-6 w-6" />
        </button>
        <button
          onClick={() => setTransactionModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900"
          aria-label="Add Transaction"
        >
          <Plus className="h-8 w-8" />
        </button>
      </div>

      <AnimatePresence>
        {isTransactionModalOpen && (
          <AddTransactionModal onClose={() => setTransactionModalOpen(false)} />
        )}
        {isScannerOpen && (
          <ReceiptScanner onClose={() => setScannerOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
