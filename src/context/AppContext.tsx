import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Transaction, Category, DeductionType, FilingStatus, TaxBreakdown } from '../types';
import { 
  DEFAULT_CATEGORIES,
  NET_EARNINGS_PERCENTAGE,
  SOCIAL_SECURITY_WAGE_BASE,
  SOCIAL_SECURITY_RATE,
  MEDICARE_RATE,
  FEDERAL_INCOME_TAX_BRACKETS,
  STATE_TAX_RATES,
  STANDARD_DEDUCTIONS
} from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

type StoragePreference = 'local' | 'drive' | null;

interface AppContextType {
  isAuthenticated: boolean;
  storagePreference: StoragePreference;
  signIn: (preference: 'local' | 'drive') => void;
  signOut: () => void;
  onboarded: boolean;
  setOnboarded: (status: boolean) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  income: number;
  expenses: number;
  netProfit: number;
  estimatedTax: number;
  taxBreakdown: TaxBreakdown;
  exportTransactionsToCSV: () => void;
  userState: string;
  setUserState: (stateAbbr: string) => void;
  taxSavingsPercentage: number;
  setTaxSavingsPercentage: (percentage: number) => void;
  deductionType: DeductionType;
  setDeductionType: (type: DeductionType) => void;
  filingStatus: FilingStatus;
  setFilingStatus: (status: FilingStatus) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

// --- Pure Tax Calculation Helpers ---

const calculateSelfEmploymentTax = (netProfit: number): number => {
    if (netProfit <= 0) return 0;
    const seTaxableIncome = netProfit * NET_EARNINGS_PERCENTAGE;
    const socialSecurityTax = Math.min(seTaxableIncome, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
    const medicareTax = seTaxableIncome * MEDICARE_RATE;
    return socialSecurityTax + medicareTax;
};

const calculateFederalIncomeTax = (netProfit: number, selfEmploymentTax: number, filingStatus: FilingStatus, deductionType: DeductionType): number => {
    if (netProfit <= 0) return 0;
    const seTaxDeduction = selfEmploymentTax * 0.5;
    const adjustedGrossIncome = netProfit - seTaxDeduction;

    let finalFederalTaxableIncome = adjustedGrossIncome;
    if (deductionType === 'standard') {
        const standardDeduction = STANDARD_DEDUCTIONS[filingStatus] || STANDARD_DEDUCTIONS.single;
        finalFederalTaxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
    }
    
    if (finalFederalTaxableIncome <= 0) return 0;
    
    let federalIncomeTax = 0;
    const brackets = FEDERAL_INCOME_TAX_BRACKETS[filingStatus] || FEDERAL_INCOME_TAX_BRACKETS.single;
    let incomeLeft = finalFederalTaxableIncome;
    let lastMax = 0;
    for (const bracket of brackets) {
        if (incomeLeft <= 0) break;
        const taxableInBracket = Math.min(incomeLeft, bracket.max - lastMax);
        federalIncomeTax += taxableInBracket * bracket.rate;
        incomeLeft -= taxableInBracket;
        lastMax = bracket.max;
    }
    return federalIncomeTax > 0 ? federalIncomeTax : 0;
};

const calculateStateTax = (netProfit: number, userState: string): number => {
    if (netProfit <= 0) return 0;
    const stateRate = STATE_TAX_RATES[userState]?.rate || 0;
    const stateTax = netProfit * stateRate;
    return stateTax > 0 ? stateTax : 0;
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [storagePreference, setStoragePreference] = useLocalStorage<StoragePreference>('steward-storage-pref', null);

  // App data state
  const [onboarded, setOnboarded] = useLocalStorage('steward-onboarded', false);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('steward-transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('steward-categories', DEFAULT_CATEGORIES.map(c => c.name));
  const [userState, setUserState] = useLocalStorage<string>('steward-user-state', '');
  const [taxSavingsPercentage, setTaxSavingsPercentage] = useLocalStorage('steward-tax-savings-percentage', 25);
  const [deductionType, setDeductionType] = useLocalStorage<DeductionType>('steward-deduction-type', 'standard');
  const [filingStatus, setFilingStatus] = useLocalStorage<FilingStatus>('steward-filing-status', 'single');


  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [estimatedTax, setEstimatedTax] = useState(0);
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown>({ selfEmployment: 0, federal: 0, state: 0 });

  const calculateFinancials = useCallback(() => {
    const currentIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const currentExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const currentNetProfit = currentIncome - currentExpenses;

    const selfEmploymentTax = calculateSelfEmploymentTax(currentNetProfit);
    const federalIncomeTax = calculateFederalIncomeTax(currentNetProfit, selfEmploymentTax, filingStatus, deductionType);
    const stateTax = calculateStateTax(currentNetProfit, userState);
    
    const totalTax = selfEmploymentTax + federalIncomeTax + stateTax;

    setIncome(currentIncome);
    setExpenses(currentExpenses);
    setNetProfit(currentNetProfit);
    setEstimatedTax(totalTax);
    setTaxBreakdown({
        selfEmployment: selfEmploymentTax,
        federal: federalIncomeTax,
        state: stateTax,
    });

  }, [transactions, userState, deductionType, filingStatus]);

  useEffect(() => {
    calculateFinancials();
  }, [transactions, userState, deductionType, filingStatus, calculateFinancials]);

  const signIn = (preference: 'local' | 'drive') => {
    // In a real app, this is where the Google Sign-In flow would be triggered.
    // For now, we just set the preference to move the user into the app.
    // The underlying storage mechanism is still localStorage for this prototype.
    setStoragePreference(preference);
  };

  const signOut = () => {
    // Clear all user data from localStorage to simulate a full sign-out.
    setStoragePreference(null);
    setOnboarded(false);
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES.map(c => c.name));
    setUserState('');
    setTaxSavingsPercentage(25);
    setDeductionType('standard');
    setFilingStatus('single');
  };


  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().toISOString() + Math.random(),
    };
    setTransactions(prev => [...prev, newTransaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const addCategory = (category: Category) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const exportTransactionsToCSV = () => {
    const headers = ['ID', 'Date', 'Source', 'Amount', 'Type', 'Category', 'Attachment (Base64)'];
    const rows = transactions.map(t => 
        [
            t.id, 
            t.date, 
            `"${t.source.replace(/"/g, '""')}"`, 
            t.amount, 
            t.type, 
            t.category,
            `"${t.attachment || ''}"`
        ].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `steward_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const value = {
    isAuthenticated: storagePreference !== null,
    storagePreference,
    signIn,
    signOut,
    onboarded,
    setOnboarded,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    categories,
    addCategory,
    income,
    expenses,
    netProfit,
    estimatedTax,
    taxBreakdown,
    exportTransactionsToCSV,
    userState,
    setUserState,
    taxSavingsPercentage,
    setTaxSavingsPercentage,
    deductionType,
    setDeductionType,
    filingStatus,
    setFilingStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
