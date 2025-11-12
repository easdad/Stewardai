import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import AddTransactionModal from './AddTransactionModal';
import { parseReceipt } from '../services/geminiService';
import { ReceiptData } from '../types';
import { Camera, RefreshCcw, Upload, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ScannerState = 'idle' | 'scanning' | 'captured' | 'loading' | 'success' | 'error' | 'confirming';

export default function ReceiptScanner({ onClose }: { onClose: () => void }) {
  const [scannerState, setScannerState] = useState<ScannerState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ReceiptData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (scannerState === 'scanning') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scannerState]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions.");
      setScannerState('error');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);
        setScannerState('captured');
        stopCamera();
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setScannerState('scanning');
  };

  const handleAnalyze = async () => {
    if (capturedImage) {
      setScannerState('loading');
      try {
        const base64Image = capturedImage.split(',')[1];
        const data = await parseReceipt(base64Image);
        setParsedData(data);
        setScannerState('success');
        setTimeout(() => setScannerState('confirming'), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setScannerState('error');
      }
    }
  };

  const renderContent = () => {
    switch (scannerState) {
      case 'idle':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium">Ready to Scan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Position your receipt within the frame and capture it.</p>
            <button onClick={() => setScannerState('scanning')} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              <Camera className="mr-2 h-5 w-5" /> Start Camera
            </button>
          </div>
        );
      case 'scanning':
        return (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-md bg-gray-900"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <button onClick={handleCapture} className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
              <Camera className="mr-2 h-5 w-5" /> Capture
            </button>
          </>
        );
      case 'captured':
        return (
          <>
            <img src={capturedImage!} alt="Captured receipt" className="w-full rounded-md" />
            <div className="mt-4 flex justify-between">
              <button onClick={handleRetake} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <RefreshCcw className="mr-2 h-5 w-5" /> Retake
              </button>
              <button onClick={handleAnalyze} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700">
                <Upload className="mr-2 h-5 w-5" /> Analyze Receipt
              </button>
            </div>
          </>
        );
      case 'loading':
      case 'success':
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-48">
            <AnimatePresence mode="wait">
              {scannerState === 'loading' && <motion.div key="loading" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}><Loader2 className="w-12 h-12 text-indigo-500 animate-spin" /></motion.div>}
              {scannerState === 'success' && <motion.div key="success" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}><CheckCircle className="w-12 h-12 text-emerald-500" /></motion.div>}
              {scannerState === 'error' && <motion.div key="error" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}><AlertTriangle className="w-12 h-12 text-red-500" /></motion.div>}
            </AnimatePresence>
            <p className="mt-4 text-center">{
              scannerState === 'loading' ? 'Analyzing...' : 
              scannerState === 'success' ? 'Analysis Complete!' : 
              error
            }</p>
            {scannerState === 'error' && (
              <button onClick={handleRetake} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Try Again
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (scannerState === 'confirming' && parsedData) {
    return (
      <AddTransactionModal
        onClose={onClose}
        initialData={{
          type: 'expense',
          description: parsedData.vendor,
          amount: parsedData.total,
          date: parsedData.date,
        }}
      />
    );
  }

  return (
    <Modal onClose={onClose} title="Scan Receipt">
      {renderContent()}
    </Modal>
  );
}
