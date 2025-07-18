import { Transaction, BudgetCategory, BudgetAllocation, DailySummary, StreakData } from '../types';
import { format, startOfDay, isToday, isYesterday, differenceInDays } from 'date-fns';

export function calculateBudgetAllocations(
  transactions: Transaction[],
  budgetCategories: BudgetCategory[]
): BudgetAllocation[] {
  const allocations: BudgetAllocation[] = [];
  
  budgetCategories.forEach(category => {
    const categoryTransactions = transactions.filter(t => 
      t.category === category.name && t.type === 'expense'
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate allocated amount based on income and percentage
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const allocated = (totalIncome * category.percentage) / 100;
    const remaining = Math.max(0, allocated - spent);
    
    allocations.push({
      categoryId: category.id,
      allocated,
      spent,
      remaining,
    });
  });
  
  return allocations;
}

export function calculateDailySummaries(transactions: Transaction[]): DailySummary[] {
  const summaries: { [key: string]: DailySummary } = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date;
    
    if (!summaries[date]) {
      summaries[date] = {
        date,
        income: 0,
        expenses: 0,
        net: 0,
      };
    }
    
    if (transaction.type === 'income') {
      summaries[date].income += transaction.amount;
    } else {
      summaries[date].expenses += transaction.amount;
    }
    
    summaries[date].net = summaries[date].income - summaries[date].expenses;
  });
  
  return Object.values(summaries).sort((a, b) => b.date.localeCompare(a.date));
}

export function calculateStreakData(transactions: Transaction[]): StreakData {
  if (transactions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedDate: '',
    };
  }
  
  // Get unique dates with transactions
  const transactionDates = [...new Set(transactions.map(t => t.date))].sort();
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = '';
  
  // Calculate streaks
  for (let i = 0; i < transactionDates.length; i++) {
    const currentDate = transactionDates[i];
    const prevDate = i > 0 ? transactionDates[i - 1] : null;
    
    if (prevDate) {
      const daysDiff = differenceInDays(new Date(currentDate), new Date(prevDate));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    lastDate = currentDate;
  }
  
  // Calculate current streak
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  if (transactionDates.includes(today)) {
    currentStreak = tempStreak;
  } else if (transactionDates.includes(yesterday)) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }
  
  return {
    currentStreak,
    longestStreak,
    lastLoggedDate: lastDate,
  };
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${Math.abs(amount).toFixed(2)}`;
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return format(dateObj, 'MMM d');
  }
}

export function getCategoryColor(categoryName: string, budgetCategories: BudgetCategory[]): string {
  const category = budgetCategories.find(c => c.name === categoryName);
  return category?.color || '#6b7280';
}

export function getCategoryIcon(categoryName: string, budgetCategories: BudgetCategory[]): string {
  const category = budgetCategories.find(c => c.name === categoryName);
  return category?.icon || '📊';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function parseAmount(input: string): number {
  // Remove currency symbols and commas, then parse
  const cleaned = input.replace(/[$,€£¥]/g, '').replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function getProgressPercentage(spent: number, allocated: number): number {
  if (allocated === 0) return 0;
  return Math.min((spent / allocated) * 100, 100);
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'success';
}