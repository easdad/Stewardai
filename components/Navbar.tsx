import React from 'react';
import { Page } from '../App';
import { HomeIcon, HistoryIcon, PlusCircleIcon } from './common/Icons';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { page: 'dashboard' as Page, icon: HomeIcon, label: 'Dashboard' },
    { page: 'add' as Page, icon: PlusCircleIcon, label: 'Add', isCentral: true },
    { page: 'history' as Page, icon: HistoryIcon, label: 'History' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-sm border-t border-gray-100 h-20 flex items-center justify-around px-4">
      {navItems.map(item => {
        const isActive = currentPage === item.page;
        if (item.isCentral) {
          return (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 transform hover:scale-110 transition-transform duration-200"
              aria-label="Add Transaction"
            >
              <item.icon className="w-8 h-8" />
            </button>
          );
        }
        return (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex flex-col items-center justify-center w-20 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-on-surface-secondary hover:text-on-surface'}`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navbar;