import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { openUrl } from '@tauri-apps/plugin-opener';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import App from './App';

export const isDesktop = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

// In the desktop app, web links open in the user's own browser, not inside the course window.
if (isDesktop) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!/^https?:\/\//i.test(href)) return;
    e.preventDefault();
    openUrl(href).catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
