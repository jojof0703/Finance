import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import ExpensePage from './pages/ExpensePage';
import IncomePage from './pages/IncomePage';
import BudgetPage from './pages/BudgetPage';
import ReportsPage from './pages/ReportsPage';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function AppContent() {
  const location = useLocation();

  // Update document title based on current route
  useEffect(() => {
    const titles: { [key: string]: string } = {
      '/': 'Spending Tracker',
      '/expense': 'Add Expense',
      '/income': 'Add Income',
      '/budget': 'Budget',
      '/reports': 'Reports',
    };
    
    document.title = titles[location.pathname] || 'Spending Tracker';
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mobile-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/expense" element={<ExpensePage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;