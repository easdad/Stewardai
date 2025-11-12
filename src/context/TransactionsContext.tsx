import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Transaction } from '../types';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTransactions = localStorage.getItem('transactions');
        return storedTransactions ? JSON.parse(storedTransactions) : [];
      } catch (error) {
        console.error("Failed to parse transactions from localStorage", error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
    };
    setTransactions((prev) => [...prev, newTransaction].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };
  
  const value = useMemo(() => ({ transactions, addTransaction, deleteTransaction }), [transactions]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}
