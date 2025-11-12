import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LogoIcon, GoogleIcon } from './common/Icons';

const Auth: React.FC = () => {
  const { signIn } = useContext(AppContext);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background text-on-surface p-8 text-center animate-fadeIn">
      <div className="flex-grow flex flex-col items-center justify-center max-w-sm w-full">
        <LogoIcon className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold font-brand text-on-surface">Welcome to Steward</h1>
        <p className="text-lg mt-2 mb-10 text-on-surface-secondary">The smart way to manage your freelance finances.</p>
        
        <div className="w-full space-y-4">
            <button
              onClick={() => signIn('drive')}
              className="w-full bg-surface text-on-surface font-bold py-3 px-4 rounded-xl shadow-subtle hover:bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <GoogleIcon className="w-6 h-6" />
              Sign in with Google
            </button>
            <button
              onClick={() => signIn('local')}
              className="w-full text-sm font-semibold text-on-surface-secondary hover:text-primary"
            >
              Use on this device only
            </button>
        </div>
      </div>
      <footer className="text-xs text-on-surface-secondary mt-8 max-w-sm">
        By signing in with Google, you'll be able to sync your data across devices. Choosing to use on this device only will store all data locally.
      </footer>
    </div>
  );
};

export default Auth;