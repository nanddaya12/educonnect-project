import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import useAuthStore from './store/useAuthStore';
import AuthReady from './components/AuthReady';

import Login from './pages/Login';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import DashboardLayout from './layouts/DashboardLayout';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EduConnect render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 text-center">
          <div className="bg-dark-800 border border-slate-700 p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Something broke</h1>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                The interface hit an unexpected error. You can reload the app; if this keeps happening, share
                the message below with support.
              </p>
            </div>
            <div className="p-4 bg-dark-900 rounded-xl font-mono text-xs text-rose-400 text-left overflow-x-auto border border-slate-700/50">
              {this.state.error?.toString() || 'Unknown Error'}
            </div>
            <button
              type="button"
              onClick={() => window.location.replace('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent-500/20 w-full uppercase tracking-wider text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthReady>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4500,
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: { primary: '#22d3ee', secondary: '#0f172a' },
              },
              error: {
                iconTheme: { primary: '#fb7185', secondary: '#0f172a' },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/trainer/*"
              element={
                <ProtectedRoute allowedRole="trainer">
                  <DashboardLayout role="trainer">
                    <TrainerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="admin">
                  <DashboardLayout role="admin">
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRole="student">
                  <DashboardLayout role="student">
                    <StudentDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthReady>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
