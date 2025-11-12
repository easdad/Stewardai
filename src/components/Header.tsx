import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Wallet } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-white">
              Steward
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
