export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  vendor?: string;
  note?: string;
  feeling?: 'happy' | 'neutral' | 'sad';
  date: string;
  timestamp: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  color: string;
  icon: string;
}

export interface BudgetAllocation {
  categoryId: string;
  allocated: number;
  spent: number;
  remaining: number;
}

export interface DailySummary {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string;
}

export interface AppState {
  transactions: Transaction[];
  budgetCategories: BudgetCategory[];
  budgetAllocations: BudgetAllocation[];
  dailySummaries: DailySummary[];
  streakData: StreakData;
  settings: {
    currency: string;
    resetFrequency: 'weekly' | 'monthly';
    notifications: boolean;
  };
}

export type Feeling = 'happy' | 'neutral' | 'sad';

export type IncomeType = 'tip' | 'paycheck';

export type ResetFrequency = 'weekly' | 'monthly';