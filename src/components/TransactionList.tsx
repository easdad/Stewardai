import { useTransactions } from '../hooks/useTransactions';
import { Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionList() {
  const { transactions, deleteTransaction } = useTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'}`}>
                  {t.type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(t.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                 <p className={`font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                   {t.type === 'income' ? '+' : '-'}
                   {formatCurrency(t.amount)}
                 </p>
                 <button
                   onClick={() => deleteTransaction(t.id)}
                   className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                   aria-label={`Delete transaction ${t.description}`}
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
