import React, { useEffect } from 'react';
import { LogoIcon } from './common/Icons';

interface WelcomeProps {
  onFinish: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-primary text-white p-4 animate-fadeIn">
      <div className="text-center">
        <LogoIcon className="w-20 h-20 mx-auto mb-4 animate-pulse" />
        <h1 className="text-5xl font-bold font-brand">Steward</h1>
        <p className="text-lg mt-2 opacity-80">Manage your finances with purpose.</p>
      </div>
    </div>
  );
};

export default Welcome;