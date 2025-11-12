import React, { useState, useContext } from 'react';
import { AppContext } from './context/AppContext';
import Welcome from './components/Welcome';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import AddTransaction from './components/AddTransaction';
import Navbar from './components/Navbar';
import TaxHelper from './components/TaxHelper';
import Auth from './components/Auth';

export type Page = 'dashboard' | 'history' | 'add' | 'taxhelper';

const App: React.FC = () => {
  const { isAuthenticated, onboarded, setOnboarded } = useContext(AppContext);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (showWelcome) {
    return <Welcome onFinish={() => setShowWelcome(false)} />;
  }
  
  if (!isAuthenticated) {
    return <Auth />;
  }

  if (!onboarded) {
    return <Onboarding onFinish={() => setOnboarded(true)} />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'history':
        return <TransactionHistory />;
      case 'add':
        return <AddTransaction goBack={() => setCurrentPage('dashboard')} />;
      case 'taxhelper':
        return <TaxHelper goBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      <main className="flex-grow pb-20">
        {renderPage()}
      </main>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;