import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent automatic scroll restoration and ensure page starts at top on load/refresh
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch (e) {
    // ignore in environments that disallow modifying scrollRestoration
  }
}
if (typeof window !== 'undefined') window.scrollTo(0, 0);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
