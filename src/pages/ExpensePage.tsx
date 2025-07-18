import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction, Feeling } from '../types';
import { generateId, parseAmount, formatCurrency } from '../utils/calculations';

const ExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const currency = state.settings.currency;

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    vendor: '',
    note: '',
    feeling: '' as Feeling | '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers, decimal point, and currency symbols
    const cleaned = value.replace(/[^0-9.,$€£¥]/g, '');
    setFormData(prev => ({ ...prev, amount: cleaned }));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseAmount(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create transaction
    const transaction: Transaction = {
      id: generateId(),
      type: 'expense',
      amount: parseAmount(formData.amount),
      category: formData.category,
      vendor: formData.vendor || undefined,
      note: formData.note || undefined,
      feeling: formData.feeling || undefined,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    // Add transaction
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    // Navigate back to home
    navigate('/');
  };

  const quickAmounts = ['5', '10', '15', '20', '25', '50'];

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
        <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Amount *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              {currency}
            </span>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className={`input-field pl-8 ${errors.amount ? 'border-danger-500' : ''}`}
              inputMode="decimal"
            />
          </div>
          {errors.amount && (
            <p className="text-danger-500 text-sm mt-1">{errors.amount}</p>
          )}
          
          {/* Quick Amount Buttons */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountChange(amount)}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {currency}{amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {state.budgetCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleInputChange('category', category.name)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.category === category.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </div>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-danger-500 text-sm mt-2">{errors.category}</p>
          )}
        </div>

        {/* Vendor Input */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Vendor (optional)
          </label>
          <input
            type="text"
            value={formData.vendor}
            onChange={(e) => handleInputChange('vendor', e.target.value)}
            placeholder="e.g., Starbucks, Uber, Amazon"
            className="input-field"
          />
        </div>

        {/* Note Input */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Note (optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="What was this for?"
            className="input-field resize-none"
            rows={3}
          />
        </div>

        {/* Feeling Selection */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How do you feel about this expense?
          </label>
          <div className="flex justify-center space-x-6">
            {[
              { value: 'happy', emoji: '😄', label: 'Happy' },
              { value: 'neutral', emoji: '😐', label: 'Neutral' },
              { value: 'sad', emoji: '😞', label: 'Sad' },
            ].map((feeling) => (
              <button
                key={feeling.value}
                type="button"
                onClick={() => handleInputChange('feeling', feeling.value as Feeling)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  formData.feeling === feeling.value
                    ? 'bg-primary-50 border-2 border-primary-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl mb-2">{feeling.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{feeling.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Expense
        </button>
      </form>
    </div>
  );
};

export default ExpensePage;