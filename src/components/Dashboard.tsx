import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { QUARTERLY_TAX_DEADLINES, STANDARD_DEDUCTIONS } from '../constants';
import { BotIcon, InfoIcon, SettingsIcon, ChevronDownIcon, LogoIcon } from './common/Icons';
import { Page } from '../App';
import SettingsModal from './SettingsModal';
import { FilingStatus } from '../types';
import { formatCurrency, formatCurrencyWithCents } from '../utils/formatters';

const FILING_STATUS_LABELS: { [key in FilingStatus]: string } = {
    single: 'Single',
    marriedFilingJointly: 'Married Filing Jointly',
    headOfHousehold: 'Head of Household'
};

interface DashboardProps {
    setCurrentPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const { income, expenses, netProfit, estimatedTax, taxBreakdown, taxSavingsPercentage, setTaxSavingsPercentage, deductionType, setDeductionType, filingStatus, signOut } = useContext(AppContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const taxSavingsGoal = income * (taxSavingsPercentage / 100);
  const savingsProgress = taxSavingsGoal > 0 ? (estimatedTax / taxSavingsGoal) * 100 : 0;
  const standardDeductionAmount = STANDARD_DEDUCTIONS[filingStatus];

  return (
    <>
      <div className="p-4 sm:p-6 space-y-5">
        <header className="flex justify-between items-center animate-fadeIn">
            <div className="flex items-center gap-3">
                <LogoIcon className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-on-surface font-brand">Steward</h1>
                  <p className="text-on-surface-secondary -mt-1">Dashboard</p>
                </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-on-surface-secondary hover:text-secondary transition-colors rounded-full hover:bg-surface"
              aria-label="Open Settings"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Total Income" amount={income} delay="100ms" />
            <StatCard title="Total Expenses" amount={expenses} delay="200ms" />
            <div className="bg-surface rounded-2xl p-4 shadow-subtle flex flex-col justify-center animate-fadeIn border border-gray-100" style={{ animationDelay: '300ms' }}>
                 <p className="text-sm text-on-surface-secondary">Net Profit</p>
                <p className="text-2xl font-bold text-secondary">{formatCurrency(netProfit)}</p>
            </div>
        </div>
        
        <div className="bg-surface rounded-2xl p-6 shadow-subtle animate-fadeIn border border-gray-100" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-baseline">
                <div>
                    <p className="text-sm text-on-surface-secondary">Total Estimated Tax</p>
                    <p className="text-4xl font-bold text-primary">{formatCurrency(estimatedTax)}</p>
                </div>
                <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="flex items-center text-sm font-medium text-primary hover:text-primary-hover">
                   <span>Details</span>
                   <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isDetailsExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {isDetailsExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fadeIn">
                    {/* Tax Breakdown */}
                    <div>
                        <h4 className="font-semibold text-on-surface mb-2">Tax Breakdown</h4>
                        <div className="space-y-2 text-sm">
                           <TaxDetailRow label="Self-Employment Tax" value={taxBreakdown.selfEmployment} tooltip="For Social Security & Medicare. Calculated on 92.35% of your net profit." />
                           <TaxDetailRow label="Federal Income Tax" value={taxBreakdown.federal} tooltip="Calculated on profit after business expenses and your personal deduction." />
                           <TaxDetailRow label="State Income Tax" value={taxBreakdown.state} />
                        </div>
                    </div>
                    {/* Deduction Details */}
                    <div>
                        <h4 className="font-semibold text-on-surface mb-2">Deduction Details</h4>
                        <div className="space-y-2 text-sm">
                           <div className="flex justify-between items-center">
                                <p className="text-on-surface-secondary">Business Expenses</p>
                                <p className="font-medium text-on-surface">{formatCurrency(expenses)}</p>
                           </div>
                           <div className="flex justify-between items-center">
                               <p className="text-on-surface-secondary">Personal Deduction</p>
                                <div className="flex items-center rounded-lg p-1 bg-background">
                                    <button onClick={() => setDeductionType('standard')} className={`px-3 py-1 text-xs font-semibold rounded-md transition ${deductionType === 'standard' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-secondary'}`}>Standard</button>
                                    <button onClick={() => setDeductionType('itemized')} className={`px-3 py-1 text-xs font-semibold rounded-md transition ${deductionType === 'itemized' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-secondary'}`}>Itemized</button>
                                </div>
                           </div>
                            {deductionType === 'standard' && (
                              <div className="flex justify-between items-center pl-4 border-l-2 border-secondary/20">
                                <p className="text-on-surface-secondary">Standard ({FILING_STATUS_LABELS[filingStatus]})</p>
                                <p className="font-medium text-green-600">-{formatCurrency(standardDeductionAmount)}</p>
                              </div>
                            )}
                        </div>
                    </div>
                     {/* Quarterly Payments */}
                    <div>
                        <h4 className="font-semibold text-on-surface mb-2">Quarterly Estimates</h4>
                        <div className="space-y-1 text-sm">
                            {QUARTERLY_TAX_DEADLINES.map(item => (
                                <div key={item.period} className="flex justify-between items-center">
                                    <p className="text-on-surface-secondary">{item.period} (due {item.deadline})</p>
                                    <p className="font-medium text-on-surface">{formatCurrencyWithCents(estimatedTax / 4)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <div className="bg-surface rounded-2xl p-6 shadow-subtle animate-fadeIn border border-gray-100" style={{ animationDelay: '500ms' }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-on-surface">Tax Savings Pot</h3>
              <span className="font-semibold text-primary">{taxSavingsPercentage}%</span>
            </div>
            <p className="text-sm text-on-surface-secondary mb-3">Set a percentage of income to save for taxes.</p>
            <input 
              type="range" min="10" max="50" step="1"
              value={taxSavingsPercentage}
              onChange={(e) => setTaxSavingsPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="mt-4">
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-on-surface-secondary">Saved: <span className="text-on-surface">{formatCurrency(estimatedTax)}</span></span>
                <span className="text-on-surface-secondary">Goal: <span className="text-on-surface">{formatCurrency(taxSavingsGoal)}</span></span>
              </div>
              <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${Math.min(100, savingsProgress)}%`}}></div>
              </div>
            </div>
        </div>
        
        <div className="animate-fadeIn" style={{ animationDelay: '600ms' }}>
           <button 
              onClick={() => setCurrentPage('taxhelper')}
              className="w-full bg-surface text-on-surface p-4 rounded-2xl flex items-center text-left shadow-subtle transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <BotIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold">Stuart AI</span>
                <span className="block text-sm text-on-surface-secondary">Ask questions about freelance taxes</span>
              </div>
            </button>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} signOut={signOut} />
    </>
  );
};

const StatCard: React.FC<{title: string, amount: number, delay: string}> = ({title, amount, delay}) => (
    <div className={`bg-surface rounded-2xl p-4 shadow-subtle animate-fadeIn border border-gray-100`} style={{ animationDelay: delay }}>
      <div>
        <p className="text-sm text-on-surface-secondary">{title}</p>
        <p className={`text-2xl font-bold text-on-surface`}>{formatCurrency(amount)}</p>
      </div>
    </div>
);

const TaxDetailRow: React.FC<{label: string, value: number, tooltip?: string}> = ({label, value, tooltip}) => (
    <div className="flex justify-between items-center">
        <p className="text-on-surface-secondary flex items-center">
            {label}
            {tooltip && (
                <div className="group relative flex items-center ml-2">
                    <InfoIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                    <div className="absolute bottom-full z-10 mb-2 w-60 bg-gray-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                       {tooltip}
                    </div>
                </div>
            )}
        </p>
        <p className="font-medium text-on-surface">{formatCurrencyWithCents(value)}</p>
    </div>
);


export default Dashboard;
