import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDailySummaries, calculateBudgetAllocations, formatCurrency, formatDate } from '../utils/calculations';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const currency = state.settings.currency;

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Calculate data
  const dailySummaries = calculateDailySummaries(state.transactions);
  const budgetAllocations = calculateBudgetAllocations(state.transactions, state.budgetCategories);

  // Filter transactions by time range
  const getFilteredTransactions = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return state.transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const filteredTransactions = getFilteredTransactions();

  // Prepare chart data
  const pieChartData = {
    labels: state.budgetCategories.map(cat => cat.name),
    datasets: [{
      data: state.budgetCategories.map(cat => {
        const allocation = budgetAllocations.find(a => a.categoryId === cat.id);
        return allocation ? allocation.spent : 0;
      }),
      backgroundColor: state.budgetCategories.map(cat => cat.color),
      borderWidth: 2,
      borderColor: '#ffffff',
    }],
  };

  const barChartData = {
    labels: dailySummaries.slice(0, 14).map(summary => formatDate(summary.date)),
    datasets: [
      {
        label: 'Income',
        data: dailySummaries.slice(0, 14).map(summary => summary.income),
        backgroundColor: '#22c55e',
        borderRadius: 4,
      },
      {
        label: 'Expenses',
        data: dailySummaries.slice(0, 14).map(summary => summary.expenses),
        backgroundColor: '#ef4444',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value, currency);
          },
        },
      },
    },
  };

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <div className="w-8"></div>
      </div>

      {/* Time Range Selector */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time Range</span>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: '7d', label: '7D' },
              { value: '30d', label: '30D' },
              { value: '90d', label: '90D' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="text-success-500 mr-1" size={16} />
            <span className="text-xs text-gray-600">Income</span>
          </div>
          <p className="text-lg font-bold text-success-600">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="text-danger-500 mr-1" size={16} />
            <span className="text-xs text-gray-600">Expenses</span>
          </div>
          <p className="text-lg font-bold text-danger-600">
            {formatCurrency(totalExpenses, currency)}
          </p>
        </div>
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-xs text-gray-600">Net</span>
          </div>
          <p className={`text-lg font-bold ${netIncome >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {formatCurrency(netIncome, currency)}
          </p>
        </div>
      </div>

      {/* Spending by Category Chart */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
        <div className="h-64">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses (Last 14 Days)</h2>
        <div className="h-64">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions in this time period</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto scroll-container">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.category}</p>
                    <p className="text-xs text-gray-500">
                      {transaction.vendor && `${transaction.vendor} • `}
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                  {transaction.feeling && (
                    <span className="text-sm">
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
    </div>
  );
};

export default ReportsPage;