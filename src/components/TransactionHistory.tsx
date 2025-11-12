import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Transaction } from '../types';
import { ArrowUpRightIcon, ArrowDownLeftIcon, EditIcon, TrashIcon, DownloadIcon, SearchIcon, LogoIcon, PaperclipIcon, XIcon } from './common/Icons';
import TransactionForm from './TransactionForm';
import { formatCurrencyWithCents } from '../utils/formatters';


const TransactionHistory: React.FC = () => {
    const { transactions, deleteTransaction, exportTransactionsToCSV } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [viewingAttachment, setViewingAttachment] = useState<string | null>(null);


    const filteredTransactions = transactions.filter(t => 
        t.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
    );

    // This function fixes the common issue where new Date('YYYY-MM-DD') is interpreted as UTC midnight,
    // which can result in the previous day's date in some timezones.
    const getLocalDate = (dateString: string) => {
        const date = new Date(dateString);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() + userTimezoneOffset);
    };
    
    return (
        <div className="p-4 sm:p-6 pb-24">
            <header className="mb-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-1">
                    <LogoIcon className="h-8 w-8 text-primary" />
                    <div>
                      <h1 className="text-3xl font-bold text-on-surface font-brand">Steward</h1>
                      <p className="text-on-surface-secondary -mt-1">Transaction History</p>
                    </div>
                </div>
            </header>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-secondary" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-subtle"
                    />
                </div>
                <button
                    onClick={exportTransactionsToCSV}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-secondary text-white font-semibold py-3 px-4 rounded-lg shadow-subtle hover:bg-secondary-hover transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="space-y-3">
                {filteredTransactions.length > 0 ? filteredTransactions.map((t, index) => (
                    <div key={t.id} className="bg-surface rounded-xl p-4 shadow-subtle flex items-center gap-4 animate-fadeIn border border-gray-100" style={{ animationDelay: `${index * 50}ms`}}>
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {t.type === 'income' ? <ArrowUpRightIcon className="text-green-600" /> : <ArrowDownLeftIcon className="text-red-600" />}
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-on-surface">{t.source}</p>
                            <p className="text-sm text-on-surface-secondary">{getLocalDate(t.date).toLocaleDateString()} &bull; {t.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                {t.type === 'income' ? '+' : '-'} {formatCurrencyWithCents(t.amount)}
                            </p>
                        </div>
                         <div className="flex items-center space-x-0">
                            {t.attachment && <button onClick={() => setViewingAttachment(t.attachment!)} className="p-2 text-on-surface-secondary rounded-full hover:bg-gray-100 hover:text-secondary"><PaperclipIcon className="w-5 h-5" /></button>}
                            <button onClick={() => setEditingTransaction(t)} className="p-2 text-on-surface-secondary rounded-full hover:bg-gray-100 hover:text-primary"><EditIcon className="w-5 h-5" /></button>
                            <button onClick={() => deleteTransaction(t.id)} className="p-2 text-on-surface-secondary rounded-full hover:bg-gray-100 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 text-on-surface-secondary">
                        <p>No transactions found.</p>
                    </div>
                )}
            </div>

            {editingTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md m-4 animate-modalIn">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
                            <TransactionForm
                                existingTransaction={editingTransaction}
                                onSave={() => setEditingTransaction(null)}
                                onCancel={() => setEditingTransaction(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {viewingAttachment && (
                 <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] animate-fadeIn" onClick={() => setViewingAttachment(null)}>
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <button onClick={() => setViewingAttachment(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-20 hover:bg-black/80">
                           <XIcon className="w-6 h-6" />
                        </button>
                        <img src={viewingAttachment} className="max-w-full max-h-full object-contain" alt="Transaction Attachment" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
