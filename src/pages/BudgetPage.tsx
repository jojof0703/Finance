import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BudgetCategory } from '../types';
import { calculateBudgetAllocations, formatCurrency, getProgressPercentage, getProgressColor } from '../utils/calculations';

const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const currency = state.settings.currency;

  const [isEditing, setIsEditing] = useState(false);
  const [editingCategories, setEditingCategories] = useState<BudgetCategory[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(100);

  // Calculate budget allocations
  const budgetAllocations = calculateBudgetAllocations(state.transactions, state.budgetCategories);

  useEffect(() => {
    setEditingCategories([...state.budgetCategories]);
    setTotalPercentage(state.budgetCategories.reduce((sum, cat) => sum + cat.percentage, 0));
  }, [state.budgetCategories]);

  const handlePercentageChange = (categoryId: string, newPercentage: number) => {
    const updatedCategories = editingCategories.map(cat =>
      cat.id === categoryId ? { ...cat, percentage: newPercentage } : cat
    );
    
    setEditingCategories(updatedCategories);
    setTotalPercentage(updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0));
  };

  const handleSave = () => {
    if (Math.abs(totalPercentage - 100) > 0.1) {
      alert('Total percentage must equal 100%');
      return;
    }
    
    dispatch({ type: 'UPDATE_BUDGET_CATEGORIES', payload: editingCategories });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingCategories([...state.budgetCategories]);
    setTotalPercentage(state.budgetCategories.reduce((sum, cat) => sum + cat.percentage, 0));
    setIsEditing(false);
  };

  const getProgressBarColor = (percentage: number) => {
    const color = getProgressColor(percentage);
    switch (color) {
      case 'danger': return 'bg-danger-500';
      case 'warning': return 'bg-warning-500';
      default: return 'bg-success-500';
    }
  };

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
        <h1 className="text-xl font-bold text-gray-900">Budget</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
        >
          {isEditing ? <X size={20} /> : <Edit3 size={20} />}
        </button>
      </div>

      {/* Total Summary */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
            <p className="text-xl font-bold text-primary-600">
              {formatCurrency(budgetAllocations.reduce((sum, a) => sum + a.allocated, 0), currency)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(budgetAllocations.reduce((sum, a) => sum + a.spent, 0), currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-4">
        {state.budgetCategories.map((category) => {
          const allocation = budgetAllocations.find(a => a.categoryId === category.id);
          const percentage = allocation ? getProgressPercentage(allocation.spent, allocation.allocated) : 0;
          
          return (
            <div key={category.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    {isEditing ? (
                      <div className="flex items-center mt-1">
                        <input
                          type="number"
                          value={category.percentage}
                          onChange={(e) => handlePercentageChange(category.id, parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded mr-1"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{category.percentage}% of income</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {allocation ? formatCurrency(allocation.spent, currency) : '$0.00'}
                  </p>
                  <p className="text-sm text-gray-500">
                    of {allocation ? formatCurrency(allocation.allocated, currency) : '$0.00'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(percentage)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              {/* Progress Details */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {percentage.toFixed(0)}% used
                </span>
                <span className="text-gray-600">
                  {allocation ? formatCurrency(allocation.remaining, currency) : '$0.00'} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Controls */}
      {isEditing && (
        <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Total Percentage:</span>
            <span className={`text-sm font-bold ${totalPercentage === 100 ? 'text-success-600' : 'text-danger-600'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          
          {totalPercentage !== 100 && (
            <p className="text-xs text-danger-600 mb-3">
              Total must equal 100% (currently {totalPercentage.toFixed(1)}%)
            </p>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={Math.abs(totalPercentage - 100) > 0.1}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} className="mr-2" />
              Save
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      {!isEditing && (
        <div className="card mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">💡 Budget Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Adjust percentages based on your priorities</li>
            <li>• Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Review and adjust your budget regularly</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;