// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider, useWeb3 } from '../src/context/Web3Context';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { UniversityDashboard } from './pages/UniversityDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { VerifierDashboard } from './pages/VarifierDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAuth?: boolean }> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { account } = useWeb3();

  if (requireAuth && !account) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/university"
            element={
              <ProtectedRoute>
                <UniversityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/verify" element={<VerifierDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Web3Provider>
      <AppRoutes />
    </Web3Provider>
  );
}

export default App;