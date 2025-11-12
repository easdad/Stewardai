export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
}

export interface ReceiptData {
  vendor: string;
  date: string;
  total: number;
  items?: { name: string; price: number }[];
}
