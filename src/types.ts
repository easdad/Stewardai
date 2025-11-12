export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  source: string;
  amount: number;
  type: TransactionType;
  category: string;
  attachment?: string; // Base64 data URL for an image
}

export type Category = string;

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export type DeductionType = 'standard' | 'itemized';

export type FilingStatus = 'single' | 'marriedFilingJointly' | 'headOfHousehold';

export interface TaxBreakdown {
  selfEmployment: number;
  federal: number;
  state: number;
}
