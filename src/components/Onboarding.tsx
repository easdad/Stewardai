import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { STATE_TAX_RATES } from '../constants';
import { FilingStatus } from '../types';

interface OnboardingProps {
  onFinish: () => void;
}

const filingStatusOptions: { id: FilingStatus, title: string, description: string }[] = [
    { id: 'single', title: 'Single', description: 'Not married, divorced, or legally separated.'},
    { id: 'marriedFilingJointly', title: 'Married Filing Jointly', description: 'You are married and filing a tax return with your spouse.' },
    { id: 'headOfHousehold', title: 'Head of Household', description: 'You are unmarried and pay more than half the costs of keeping up a home for a qualifying person.' },
];

const onboardingSteps = [
  {
    title: 'Welcome to Steward!',
    description: 'Track your income and expenses effortlessly as a private contractor.',
    icon: '👋',
  },
  {
    title: 'Scan Receipts with AI',
    description: 'Snap a picture of any receipt or invoice, and our AI will extract the details for you.',
    icon: '📸',
  },
  {
    title: 'Select Your State',
    description: 'This helps us provide a more accurate tax estimate based on your state income tax rate.',
    icon: '📍',
  },
  {
    title: 'Set Your Filing Status',
    description: 'Your filing status determines your standard deduction and tax brackets.',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    title: 'Estimate Your Taxes',
    description: 'Get a real-time estimate of your tax obligations based on your financial activity.',
    icon: '💸',
  },
  {
    title: 'Stay Organized',
    description: "View your transaction history, manage custom categories, and export your data anytime.",
    icon: '📊',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const { userState, setUserState, filingStatus, setFilingStatus } = useContext(AppContext);

  const handleNext = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const currentStep = onboardingSteps[step];

  const renderStepContent = () => {
    switch (step) {
        case 2: // Select Your State
            return (
                <div className="w-full max-w-sm">
                    <p className="text-on-surface-secondary max-w-sm mb-4">{currentStep.description}</p>
                    <select
                        value={userState}
                        onChange={(e) => setUserState(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-gray-200 rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label="Select your state"
                    >
                        <option value="" disabled>Choose Your State</option>
                        {Object.entries(STATE_TAX_RATES).map(([abbr, { name }]) => (
                            <option key={abbr} value={abbr}>{name}</option>
                        ))}
                    </select>
                </div>
            );
        case 3: // Set Your Filing Status
            return (
                <div className="w-full max-w-sm text-left">
                     <p className="text-on-surface-secondary text-center max-w-sm mb-4">{currentStep.description}</p>
                     <div className="space-y-3">
                        {filingStatusOptions.map(option => (
                           <div key={option.id} onClick={() => setFilingStatus(option.id)} className={`p-4 border rounded-lg cursor-pointer transition ${filingStatus === option.id ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-surface border-gray-200 hover:border-gray-400'}`}>
                                <p className="font-bold text-on-surface">{option.title}</p>
                                <p className="text-sm text-on-surface-secondary">{option.description}</p>
                           </div>
                        ))}
                     </div>
                </div>
            );
        default:
            return <p className="text-on-surface-secondary max-w-sm">{currentStep.description}</p>;
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between bg-surface p-8 text-center animate-fadeIn">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">{currentStep.icon}</div>
        <h2 className="text-3xl font-bold text-on-surface mb-3">{currentStep.title}</h2>
        {renderStepContent()}
      </div>
      
      <div className="w-full max-w-sm">
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === step ? 'bg-primary w-6' : 'bg-gray-300'}`}></div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={step === 2 && !userState}
          className="w-full bg-primary text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {step < onboardingSteps.length - 1 ? 'Next' : "Let's Get Started"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
