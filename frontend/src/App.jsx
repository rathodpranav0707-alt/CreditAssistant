import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FinancialProvider } from './context/FinancialContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { FinancialProfilePage } from './pages/FinancialProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { AIRecommendationsPage } from './pages/AIRecommendationsPage';
import { FinancialReportPage } from './pages/FinancialReportPage';

import { ScrollMotionManager } from './components/ScrollMotionManager';

function App() {
  return (
    <AuthProvider>
      <FinancialProvider>
        <Router>
          <ScrollMotionManager />
          <Routes>
            {/* 1. Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* 2. Register Page */}
            <Route path="/register" element={<RegisterPage />} />

            {/* 3. Login Page */}
            <Route path="/login" element={<LoginPage />} />

            {/* 4. Financial Profile Page */}
            <Route path="/profile" element={<FinancialProfilePage />} />

            {/* 5. Dashboard Page */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 6. AI Recommendations Page */}
            <Route path="/recommendations" element={<AIRecommendationsPage />} />

            {/* 7. Financial Report Page */}
            <Route path="/report" element={<FinancialReportPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </FinancialProvider>
    </AuthProvider>
  );
}

export default App;
