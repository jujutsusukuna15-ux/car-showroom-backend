import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { CustomersPage } from './pages/customers/CustomersPage';
import { VehiclesPage } from './pages/vehicles/VehiclesPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';
import { RepairsPage } from './pages/repairs/RepairsPage';
import { SparePartsPage } from './pages/spare-parts/SparePartsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { UsersPage } from './pages/users/UsersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppInner() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers/*" element={<CustomersPage />} />
          <Route path="vehicles/*" element={<VehiclesPage />} />
          <Route path="transactions/*" element={<TransactionsPage />} />
          <Route path="repairs/*" element={<RepairsPage />} />
          <Route path="spare-parts/*" element={<SparePartsPage />} />
          <Route path="reports/*" element={<ReportsPage />} />
          <Route path="users/*" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInner />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
