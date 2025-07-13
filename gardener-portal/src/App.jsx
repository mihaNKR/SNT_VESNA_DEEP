import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { LoadingOverlay, ErrorBoundary, PageLayout } from './components/ui';
import './App.scss';

// Ленивая загрузка страниц
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));
const VotingPage = React.lazy(() => import('./pages/VotingPage'));
const ForumPage = React.lazy(() => import('./pages/ForumPage'));
const MetersPage = React.lazy(() => import('./pages/MetersPage'));
const CalendarPage = React.lazy(() => import('./pages/CalendarPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Компонент защищенных маршрутов
const ProtectedRoute = ({ children, requiredPermissions = [], anyPermission = false }) => {
  const { user, hasPermission, hasAnyPermission } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = anyPermission 
      ? hasAnyPermission(requiredPermissions)
      : hasPermission(requiredPermissions);
    
    if (!hasAccess) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return children;
};

// Компонент для аутентификационных маршрутов
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

const AppContent = () => {
  const { checkSession } = useAuth();

  // Проверка сессии при загрузке
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <PageLayout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingOverlay />}>
          <Routes>
            {/* Аутентификация */}
            <Route path="/login" element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            } />
            
            <Route path="/register" element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            } />

            {/* Основные маршруты */}
            <Route path="/" element={
              <ProtectedRoute requiredPermissions={['VIEW_DASHBOARD']}>
                <DashboardPage />
              </ProtectedRoute>
            }>
              <Route index element={
                <ProtectedRoute requiredPermissions={['VIEW_PROFILE']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="payments" element={
                <ProtectedRoute anyPermission={['VIEW_PAYMENTS', 'MAKE_PAYMENTS']}>
                  <PaymentsPage />
                </ProtectedRoute>
              } />
              <Route path="voting" element={
                <ProtectedRoute requiredPermissions={['PARTICIPATE_VOTING']}>
                  <VotingPage />
                </ProtectedRoute>
              } />
              <Route path="forum" element={
                <ProtectedRoute requiredPermissions={['VIEW_FORUM']}>
                  <ForumPage />
                </ProtectedRoute>
              } />
              <Route path="meters" element={
                <ProtectedRoute requiredPermissions={['SUBMIT_METER_READINGS']}>
                  <MetersPage />
                </ProtectedRoute>
              } />
              <Route path="calendar" element={
                <ProtectedRoute requiredPermissions={['VIEW_CALENDAR']}>
                  <CalendarPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* Служебные маршруты */}
            <Route path="/not-authorized" element={
              <div className="error-page">
                <h2>Доступ запрещен</h2>
                <p>У вас недостаточно прав для просмотра этой страницы.</p>
              </div>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
