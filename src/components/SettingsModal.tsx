import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { STATE_TAX_RATES } from '../constants';
import { FilingStatus } from '../types';
import { GoogleIcon } from './common/Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  signOut: () => void;
}

const filingStatusOptions: { id: FilingStatus, title: string }[] = [
    { id: 'single', title: 'Single' },
    { id: 'marriedFilingJointly', title: 'Married Filing Jointly' },
    { id: 'headOfHousehold', title: 'Head of Household' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, signOut }) => {
  const { userState, setUserState, filingStatus, setFilingStatus, storagePreference } = useContext(AppContext);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-2xl shadow-xl w-full max-w-md m-4 p-6 space-y-6 animate-modalIn"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div>
            <h2 className="text-2xl font-bold text-on-surface mb-6">Settings</h2>

            {/* Data Sync Section */}
            <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-on-surface-secondary mb-2">Data Sync</label>
                {storagePreference === 'drive' ? (
                    <div className="p-3 bg-background rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <GoogleIcon className="w-5 h-5"/>
                           <span className="text-sm font-medium text-on-surface">Syncing with Google Drive</span>
                        </div>
                        <button onClick={signOut} className="text-sm font-bold text-red-500 hover:text-red-700">Disconnect</button>
                    </div>
                ) : (
                    <div className="p-3 bg-background rounded-lg flex items-center justify-between">
                        <span className="text-sm text-on-surface">Data is stored on this device</span>
                        <button onClick={signOut} className="text-sm font-bold text-primary hover:text-primary-hover">Connect</button>
                    </div>
                )}
            </div>

            {/* Tax Settings Section */}
            <div>
              <label className="block text-sm font-medium text-on-surface-secondary mb-2">Tax Profile</label>
              <div className="space-y-4">
                  <div>
                      <select
                          id="state-select"
                          value={userState}
                          onChange={(e) => setUserState(e.target.value)}
                          className="w-full px-4 py-3 bg-background border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                          {Object.entries(STATE_TAX_RATES).map(([abbr, { name }]) => (
                              <option key={abbr} value={abbr}>{name}</option>
                          ))}
                      </select>
                  </div>

                  <div>
                      <div className="space-y-2">
                          {filingStatusOptions.map(option => (
                              <div key={option.id} onClick={() => setFilingStatus(option.id)} className={`p-3 border rounded-lg cursor-pointer transition flex items-center ${filingStatus === option.id ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-background border-gray-200 hover:border-gray-300'}`}>
                                  <span className="font-semibold text-on-surface">{option.title}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            </div>
        </div>

        <div className="text-right">
             <button
                onClick={onClose}
                className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-hover focus:ring-opacity-50 transition-colors"
            >
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
