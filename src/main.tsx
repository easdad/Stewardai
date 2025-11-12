import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { TransactionsProvider } from './context/TransactionsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
