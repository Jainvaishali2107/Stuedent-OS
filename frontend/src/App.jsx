import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/components/NotificationProvider';
import { ProtectedRoute, PublicRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Todos from '@/pages/Todos';
import Classes from '@/pages/Classes';
import Events from '@/pages/Events';
import Hackathons from '@/pages/Hackathons';
import Calendar from '@/pages/Calendar';
import Profile from '@/pages/Profile';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const app = (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/todos" element={<AppLayout><Todos /></AppLayout>} />
            <Route path="/classes" element={<AppLayout><Classes /></AppLayout>} />
            <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
            <Route path="/hackathons" element={<AppLayout><Hackathons /></AppLayout>} />
            <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );

  if (googleClientId) {
    return <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>;
  }

  return app;
}
