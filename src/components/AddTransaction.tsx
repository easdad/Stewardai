import React, { useState, useRef, useCallback, useContext } from 'react';
import { parseDocument } from '../services/geminiService';
import { Transaction } from '../types';
import { AppContext } from '../context/AppContext';
import { CameraIcon, EditIcon, LogoIcon } from './common/Icons';
import TransactionForm from './TransactionForm';

interface CameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure permissions are granted.");
      onClose();
    }
  }, [onClose]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg', 0.9));
      }
      stopCamera();
    }
  };
  
  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fadeIn">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            
      <button onClick={onClose} className="absolute top-4 left-4 text-white bg-black bg-opacity-50 rounded-full py-2 px-4 z-20">
        Close
      </button>

      <div className="absolute bottom-8 flex flex-col items-center z-20">
        <button onClick={handleCapture} className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-gray-300 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-white ring-2 ring-inset ring-black"></div>
        </button>
      </div>
    </div>
  );
};


const AddTransaction: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const { categories } = useContext(AppContext);
  const [view, setView] = useState<'options' | 'camera' | 'form'>('options');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prefilledData, setPrefilledData] = useState<Partial<Transaction> | undefined>(undefined);

  const handleCapture = async (imageDataUrl: string) => {
    setView('form');
    setLoading(true);
    setError('');
    try {
      const base64Data = imageDataUrl.split(',')[1];
      const parsedData = await parseDocument(base64Data, categories);
      setPrefilledData({ ...parsedData, attachment: imageDataUrl });
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualEntry = () => {
    setPrefilledData(undefined);
    setView('form');
  };
  
  const handleFormSave = () => {
    goBack();
  }
  
  const handleFormCancel = () => {
    if(prefilledData) {
        setView('options');
        setPrefilledData(undefined);
    } else {
        goBack();
    }
  }

  if (view === 'camera') {
    return <CameraScanner onCapture={handleCapture} onClose={() => setView('options')} />;
  }
  
  if (view === 'form') {
    return (
      <div className="p-4 sm:p-6 animate-fadeIn">
        <div className="bg-surface p-6 rounded-2xl shadow-subtle border border-gray-100">
            <header className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                    <LogoIcon className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold text-on-surface font-brand">Steward</h1>
                        <p className="text-on-surface-secondary -mt-1">{prefilledData ? 'Review Transaction' : 'New Transaction'}</p>
                    </div>
                </div>
                {loading && <p className="text-on-surface-secondary mt-2">AI is analyzing your document...</p>}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </header>
            {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            ) : (
            <TransactionForm 
                onSave={handleFormSave} 
                onCancel={handleFormCancel}
                existingTransaction={prefilledData} 
            />
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col h-full animate-fadeIn">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
            <LogoIcon className="h-8 w-8 text-primary" />
             <div>
              <h1 className="text-3xl font-bold text-on-surface font-brand">Steward</h1>
              <p className="text-on-surface-secondary -mt-1">Add Transaction</p>
            </div>
        </div>
      </header>
      <div className="flex-grow flex flex-col justify-center gap-4">
        <OptionButton 
          icon={CameraIcon}
          title="Scan Document"
          description="Use AI for receipts, invoices, or checks"
          onClick={() => {
            setView('camera');
          }}
        />
        <OptionButton 
          icon={EditIcon}
          title="Enter Manually"
          description="Fill in the details yourself"
          onClick={handleManualEntry}
          isSecondary
        />
      </div>
    </div>
  );
};

interface OptionButtonProps {
    icon: React.FC<{className?: string}>;
    title: string;
    description: string;
    onClick: () => void;
    isSecondary?: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({ icon: Icon, title, description, onClick, isSecondary }) => (
    <button 
        onClick={onClick}
        className={`p-5 rounded-2xl flex items-center text-left shadow-subtle transform hover:-translate-y-1 transition-transform duration-300 ${isSecondary ? 'bg-surface border border-gray-200' : 'bg-gradient-to-br from-primary to-primary-hover text-white'}`}
    >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${isSecondary ? 'bg-primary/10' : 'bg-white/10'}`}>
            <Icon className={`w-7 h-7 ${isSecondary ? 'text-primary' : 'text-white'}`} />
        </div>
        <div>
            <span className={`text-lg font-bold ${isSecondary ? 'text-on-surface' : 'text-white'}`}>{title}</span>
            <span className={`block text-sm ${isSecondary ? 'text-on-surface-secondary' : 'opacity-80'}`}>{description}</span>
        </div>
    </button>
);

export default AddTransaction;
