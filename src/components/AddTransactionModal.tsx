import { useState, FormEvent } from 'react';
import Modal from './Modal';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, TransactionType } from '../types';

interface AddTransactionModalProps {
  onClose: () => void;
  initialData?: Partial<Transaction>;
}

export default function AddTransactionModal({ onClose, initialData }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [description, setDescription] = useState(initialData?.description || '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const { addTransaction } = useTransactions();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      alert('Please fill out all fields.');
      return;
    }
    addTransaction({
      type,
      description,
      amount: parseFloat(amount),
      date,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Add New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md w-full ${type === 'income' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md w-full ${type === 'expense' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Expense
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
}
