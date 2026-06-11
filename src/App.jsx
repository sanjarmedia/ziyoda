import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FarmProvider, useFarm } from './context/FarmContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AnimalsPage from './pages/AnimalsPage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import FeedPlanPage from './pages/FeedPlanPage';
import VetRecordsPage from './pages/VetRecordsPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { currentUser, logout } = useFarm();

  // Protected Route Wrapper with role validation
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected layout routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout user={currentUser} onLogout={logout} />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="animals/:id" element={<AnimalDetailPage />} />
          <Route 
            path="feed-plans" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'fermer']}>
                <FeedPlanPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="vet-records" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'veterinar', 'fermer']}>
                <VetRecordsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Wildcard fallback redirects to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <FarmProvider>
      <AppContent />
    </FarmProvider>
  );
}
