import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDailySummaries, calculateStreakData, formatCurrency } from '../utils/calculations';

const HomePage: React.FC = () => {
  const { state, dispatch } = useApp();
  
  // Calculate daily summaries and streak data
  const dailySummaries = calculateDailySummaries(state.transactions);
  const streakData = calculateStreakData(state.transactions);
  
  // Update streak data in state
  useEffect(() => {
    dispatch({ type: 'UPDATE_STREAK_DATA', payload: streakData });
  }, [state.transactions, dispatch]);

  const today = dailySummaries[0] || { income: 0, expenses: 0, net: 0 };
  const currency = state.settings.currency;

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Spending Tracker</h1>
        <p className="text-gray-600">Track your money, build better habits</p>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-4">
        <Link
          to="/expense"
          className="flex-1 bg-danger-500 hover:bg-danger-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </Link>
        <Link
          to="/income"
          className="flex-1 bg-success-500 hover:bg-success-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Income</span>
        </Link>
      </div>

      {/* Daily Summary Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="text-success-500 mr-1" size={16} />
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <p className="text-lg font-bold text-success-600">
              {formatCurrency(today.income, currency)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="text-danger-500 mr-1" size={16} />
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
            <p className="text-lg font-bold text-danger-600">
              {formatCurrency(today.expenses, currency)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="text-primary-500 mr-1" size={16} />
              <span className="text-sm text-gray-600">Net</span>
            </div>
            <p className={`text-lg font-bold ${today.net >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {formatCurrency(today.net, currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Streak</h2>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {streakData.currentStreak} days
          </div>
          <p className="text-gray-600 mb-3">
            {streakData.currentStreak > 0 
              ? `You've logged transactions for ${streakData.currentStreak} day${streakData.currentStreak > 1 ? 's' : ''} in a row!`
              : "Start your tracking streak today!"
            }
          </p>
          {streakData.longestStreak > 0 && (
            <p className="text-sm text-gray-500">
              Longest streak: {streakData.longestStreak} days
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/reports" className="text-primary-600 text-sm font-medium">
            View All
          </Link>
        </div>
        {state.transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-400">Add your first expense or income to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-lg">
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.category}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.vendor && `${transaction.vendor} • `}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  {transaction.feeling && (
                    <span className="text-lg">
                      {transaction.feeling === 'happy' ? '😄' : 
                       transaction.feeling === 'neutral' ? '😐' : '😞'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Budget Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
          <Link to="/budget" className="text-primary-600 text-sm font-medium">
            View Details
          </Link>
        </div>
        <div className="space-y-3">
          {state.budgetCategories.slice(0, 3).map((category) => {
            const allocation = state.budgetAllocations.find(a => a.categoryId === category.id);
            const percentage = allocation ? (allocation.spent / allocation.allocated) * 100 : 0;
            
            return (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {allocation ? formatCurrency(allocation.spent, currency) : '$0.00'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {allocation ? `${percentage.toFixed(0)}%` : '0%'} used
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;