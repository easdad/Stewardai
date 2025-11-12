import React, { useState, useEffect, useRef } from 'react';
import { startTaxChat } from '../services/geminiService';
import { BotIcon, InfoIcon } from './common/Icons';
import { Chat } from '@google/genai';

interface TaxHelperProps {
  goBack: () => void;
}

const TaxHelper: React.FC<TaxHelperProps> = ({ goBack }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startTaxChat());
    setMessages([
        {
            role: 'model',
            parts: [{ text: "Hello! I'm Stuart AI. I can help answer general questions about self-employment taxes in the US. What's on your mind? \n\nFor example, you could ask: *'What are some common tax deductions?'*"}]
        }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMessage = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: input });
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].parts[0].text = modelResponse;
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic markdown to HTML renderer
  const renderMessage = (text: string) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/(\r\n|\n|\r)/g, '<br />'); // Newlines
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col h-screen bg-background animate-fadeIn">
      <header className="bg-surface p-4 shadow-sm flex items-center justify-between z-10">
        <button onClick={goBack} className="text-on-surface-secondary hover:text-primary">&larr; Back</button>
        <h1 className="text-xl font-bold text-on-surface">Stuart AI</h1>
        <div className="w-12"></div>
      </header>

      <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-3 text-xs m-4 rounded flex items-start">
        <InfoIcon className="w-8 h-8 mr-2 flex-shrink-0"/>
        <span>I am an AI assistant, not a certified tax professional. Please consult a human expert for financial advice.</span>
      </div>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <BotIcon className="w-6 h-6 bg-primary text-white rounded-full p-1 flex-shrink-0" />}
              <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-lg' : 'bg-surface text-on-surface rounded-bl-lg'}`}>
                {renderMessage(msg.parts[0].text)}
                {isLoading && index === messages.length -1 && msg.role === 'model' && <div className="animate-pulse">...</div>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-surface border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about freelance taxes..."
            className="flex-grow w-full px-4 py-3 bg-background border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary text-white rounded-full p-3 disabled:bg-gray-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TaxHelper;
