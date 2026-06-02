import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { GoalsPage } from './pages/GoalsPage';
import { CalendarPage } from './pages/CalendarPage';
import { RoutinePage } from './pages/RoutinePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useAppStore } from './store/useAppStore';
import { useAuthStore } from './store/useAuthStore';
import { SessionTimeoutModal } from './components/auth/SessionTimeoutModal';

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  const { fetchUser, fetchGoals, fetchRoutines, fetchDashboardStats } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
      fetchGoals();
      fetchRoutines();
      fetchDashboardStats();
    }
  }, [isAuthenticated, fetchUser, fetchGoals, fetchRoutines, fetchDashboardStats]);

  // Activity timer for session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: any;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Show modal after 14 minutes of inactivity (just before 15 min token expiry)
      inactivityTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('session-expired'));
      }, 14 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" replace />
          }
        />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/availability" element={<RoutinePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SessionTimeoutModal />
    </Router>
  );
}

export default App;
