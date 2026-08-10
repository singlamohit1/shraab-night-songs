import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import './index.css';
import App from './App.jsx';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  loaded: (posthog) => {
    if (import.meta.env.DEV) posthog.debug();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
