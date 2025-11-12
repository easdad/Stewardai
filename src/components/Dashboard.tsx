import { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from './TransactionList';
import { ArrowDownCircle, ArrowUpCircle, PiggyBank, ReceiptText } from 'lucide-react';

const TAX_RATE = 0.25; // Example flat tax rate of 25%

export default function Dashboard() {
  const { transactions } = useTransactions();

  const summary = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;
    const estimatedTax = Math.max(0, net * TAX_RATE);

    return { income, expenses, net, estimatedTax };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const summaryCards = [
    { title: 'Total Income', value: formatCurrency(summary.income), icon: ArrowUpCircle, color: 'text-emerald-500' },
    { title: 'Total Expenses', value: formatCurrency(summary.expenses), icon: ArrowDownCircle, color: 'text-red-500' },
    { title: 'Net Income', value: formatCurrency(summary.net), icon: PiggyBank, color: 'text-indigo-500' },
    { title: 'Est. Tax Owed', value: formatCurrency(summary.estimatedTax), icon: ReceiptText, color: 'text-amber-500' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card) => (
            <div key={card.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <TransactionList />
      </section>
    </div>
  );
}
