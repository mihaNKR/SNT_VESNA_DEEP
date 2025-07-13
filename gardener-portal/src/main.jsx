import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/main.scss';

// Инициализация Sentry для мониторинга ошибок (если включено)
if (process.env.REACT_APP_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_ENV || 'development',
      release: `gardener-portal@${process.env.REACT_APP_VERSION || '0.0.0'}`,
      integrations: [new Sentry.BrowserTracing()],
      tracesSampleRate: 0.2,
    });
  });
}

// Получаем корневой элемент
const container = document.getElementById('root');
const root = createRoot(container);

// Рендерим приложение
root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.REACT_APP_BASE_PATH || ''}>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Если нужно измерить производительность
if (process.env.REACT_APP_MEASURE_PERFORMANCE === 'true') {
  reportWebVitals(console.log);
}
