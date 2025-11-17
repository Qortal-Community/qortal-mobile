import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import  "./messaging/messagesToBackground";
import { MessageQueueProvider } from './MessageQueueContext.tsx';
import { RecoilRoot } from 'recoil';
import './utils/nativepow.ts'
import { AppThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
      <AppThemeProvider>
  <MessageQueueProvider>
  <RecoilRoot>
    <App />
    </RecoilRoot>
    </MessageQueueProvider>
    </AppThemeProvider>
  </>,
)
