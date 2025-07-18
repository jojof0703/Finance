import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Transaction, BudgetCategory, BudgetAllocation, DailySummary, StreakData } from '../types';

// Initial state
const initialState: AppState = {
  transactions: [],
  budgetCategories: [
    { id: '1', name: 'Food & Dining', percentage: 25, color: '#ef4444', icon: '🍽️' },
    { id: '2', name: 'Transportation', percentage: 15, color: '#3b82f6', icon: '🚗' },
    { id: '3', name: 'Entertainment', percentage: 10, color: '#8b5cf6', icon: '🎬' },
    { id: '4', name: 'Shopping', percentage: 20, color: '#f59e0b', icon: '🛍️' },
    { id: '5', name: 'Bills & Utilities', percentage: 20, color: '#10b981', icon: '💡' },
    { id: '6', name: 'Savings', percentage: 10, color: '#06b6d4', icon: '💰' },
  ],
  budgetAllocations: [],
  dailySummaries: [],
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastLoggedDate: '',
  },
  settings: {
    currency: '$',
    resetFrequency: 'weekly',
    notifications: true,
  },
};

// Action types
type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_BUDGET_CATEGORIES'; payload: BudgetCategory[] }
  | { type: 'UPDATE_BUDGET_ALLOCATIONS'; payload: BudgetAllocation[] }
  | { type: 'UPDATE_DAILY_SUMMARIES'; payload: DailySummary[] }
  | { type: 'UPDATE_STREAK_DATA'; payload: StreakData }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'UPDATE_BUDGET_CATEGORIES':
      return {
        ...state,
        budgetCategories: action.payload,
      };
    case 'UPDATE_BUDGET_ALLOCATIONS':
      return {
        ...state,
        budgetAllocations: action.payload,
      };
    case 'UPDATE_DAILY_SUMMARIES':
      return {
        ...state,
        dailySummaries: action.payload,
      };
    case 'UPDATE_STREAK_DATA':
      return {
        ...state,
        streakData: action.payload,
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('spending-tracker-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('spending-tracker-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}