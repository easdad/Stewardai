import { useTransactions } from '../hooks/useTransactions';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle, Trash2, Calendar, FileText } from 'lucide-react';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your first income or expense to get started!</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                {t.type === 'income' ? (
                  <ArrowUpCircle className="w-8 h-8 text-emerald-500 mr-4" />
                ) : (
                  <ArrowDownCircle className="w-8 h-8 text-red-500 mr-4" />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{t.description}</span>
                  <div className='flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1'>
                    <Calendar className='w-3.5 h-3.5 mr-1.5' />
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`font-bold text-lg mr-6 ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Delete transaction"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
