import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import ScrollToTop from './components/ScrollToTop'
import { reportAppError } from './lib/appError'

const initialLanguage = localStorage.getItem('i18nextLng') === 'en' ? 'en' : 'ar';
const initialDirection = initialLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLanguage;
document.documentElement.dir = initialDirection;
document.body.lang = initialLanguage;
document.body.dir = initialDirection;

const getInitialTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  return 'light';
};

const initialTheme = getInitialTheme();
document.documentElement.classList.toggle('dark', initialTheme === 'dark');
localStorage.setItem('theme', initialTheme);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      reportAppError({ scope: 'service-worker-register', error });
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
