import React, { useState, useContext, useEffect, useRef } from 'react';
import { Transaction, TransactionType } from '../types';
import { AppContext } from '../context/AppContext';
import { PaperclipIcon, XIcon } from './common/Icons';

interface TransactionFormProps {
  existingTransaction?: Partial<Transaction>;
  onSave: () => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ existingTransaction, onSave, onCancel }) => {
  const { addTransaction, updateTransaction, categories, addCategory } = useContext(AppContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    source: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: '',
    attachment: '',
  });

  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    if (existingTransaction) {
      setFormData({
        date: existingTransaction.date || new Date().toISOString().split('T')[0],
        source: existingTransaction.source || '',
        amount: existingTransaction.amount?.toString() || '',
        type: existingTransaction.type || 'expense',
        category: existingTransaction.category || '',
        attachment: existingTransaction.attachment || '',
      });
    }
  }, [existingTransaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
      setFormData(prev => ({...prev, category: value}));
    }
  };
  
  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setFormData(prev => ({...prev, category: newCategory.trim()}));
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, attachment: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transactionData = {
      date: formData.date,
      source: formData.source,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      attachment: formData.attachment,
    };
    
    if (isNaN(transactionData.amount) || !transactionData.source || !transactionData.category) {
        alert("Please fill all required fields.");
        return;
    }

    if (existingTransaction && 'id' in existingTransaction && existingTransaction.id) {
        updateTransaction({ ...transactionData, id: existingTransaction.id });
    } else {
        addTransaction(transactionData);
    }
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Type</label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-background p-1">
          <button type="button" onClick={() => setFormData(p => ({...p, type: 'income'}))} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${formData.type === 'income' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-secondary'}`}>Income</button>
          <button type="button" onClick={() => setFormData(p => ({...p, type: 'expense'}))} className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${formData.type === 'expense' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-secondary'}`}>Expense</button>
        </div>
      </div>
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-on-surface-secondary mb-1">Amount</label>
        <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} step="0.01" placeholder="0.00" required className="mt-1 block w-full px-3 py-2 bg-background border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
      </div>
      
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-on-surface-secondary mb-1">Source / Vendor</label>
        <input type="text" name="source" id="source" value={formData.source} onChange={handleChange} placeholder="e.g., Client Name, Office Depot" required className="mt-1 block w-full px-3 py-2 bg-background border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-on-surface-secondary mb-1">Date</label>
        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-on-surface-secondary mb-1">Category</label>
        <select name="category" id="category" value={formData.category} onChange={handleCategoryChange} required className="mt-1 block w-full px-3 py-2 bg-background border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
          <option value="">Select a category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          <option value="__new__">-- Add New Category --</option>
        </select>
      </div>

      {showNewCategoryInput && (
        <div className="flex gap-2 animate-fadeIn">
            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="flex-grow block w-full px-3 py-2 bg-background border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            <button type="button" onClick={handleAddNewCategory} className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-hover transition-colors">Add</button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-on-surface-secondary mb-1">Attachment</label>
        {formData.attachment ? (
          <div className="mt-1 flex items-center justify-between p-2 bg-background border border-gray-200 rounded-md">
            <div className="flex items-center gap-2">
              <img src={formData.attachment} alt="Attachment preview" className="w-10 h-10 object-cover rounded" />
              <span className="text-sm text-on-surface">Image attached.</span>
            </div>
            <button type="button" onClick={() => setFormData(p => ({...p, attachment: ''}))} className="p-1 text-on-surface-secondary rounded-full hover:bg-gray-200">
                <XIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 bg-background border border-dashed border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                <PaperclipIcon className="w-5 h-5 text-on-surface-secondary" />
                <span className="text-sm font-medium text-primary">Attach Photo</span>
            </button>
          </>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-on-surface-secondary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg shadow-sm hover:bg-primary-hover transition-colors">Save Transaction</button>
      </div>
    </form>
  );
};

export default TransactionForm;