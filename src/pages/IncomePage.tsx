import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction, IncomeType } from '../types';
import { generateId, parseAmount, formatCurrency } from '../utils/calculations';

const IncomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const currency = state.settings.currency;

  const [formData, setFormData] = useState({
    amount: '',
    type: '' as IncomeType | '',
    note: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmountChange = (value: string) => {
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
    
    if (!formData.type) {
      newErrors.type = 'Income type is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create transaction
    const transaction: Transaction = {
      id: generateId(),
      type: 'income',
      amount: parseAmount(formData.amount),
      category: formData.type === 'tip' ? 'Tips' : 'Paycheck',
      vendor: formData.type === 'tip' ? 'Tips' : 'Work',
      note: formData.note || undefined,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
    };

    // Add transaction
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });

    // Navigate back to home
    navigate('/');
  };

  const quickAmounts = ['5', '10', '20', '50', '100', '200'];

  const incomeTypes = [
    {
      value: 'tip',
      label: 'Tip',
      description: 'Daily tips or gratuity',
      icon: '💡',
    },
    {
      value: 'paycheck',
      label: 'Paycheck',
      description: 'Regular salary or wages',
      icon: '💰',
    },
  ];

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
        <h1 className="text-xl font-bold text-gray-900">Add Income</h1>
        <div className="w-8"></div>
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

        {/* Income Type Selection */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Income Type *
          </label>
          <div className="space-y-3">
            {incomeTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  formData.type === type.value
                    ? 'border-success-500 bg-success-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.type && (
            <p className="text-danger-500 text-sm mt-2">{errors.type}</p>
          )}
        </div>

        {/* Note Input */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Note (optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            placeholder="e.g., Evening shift tips, Overtime bonus"
            className="input-field resize-none"
            rows={3}
          />
        </div>

        {/* Budget Distribution Preview */}
        {formData.amount && parseAmount(formData.amount) > 0 && (
          <div className="card">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              This income will be distributed to your budget categories:
            </h3>
            <div className="space-y-2">
              {state.budgetCategories.map((category) => {
                const allocated = (parseAmount(formData.amount) * category.percentage) / 100;
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(allocated, currency)}
                      </p>
                      <p className="text-xs text-gray-500">{category.percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center gap-2 bg-success-500 hover:bg-success-600"
        >
          <Save size={20} />
          Save Income
        </button>
      </form>
    </div>
  );
};

export default IncomePage;