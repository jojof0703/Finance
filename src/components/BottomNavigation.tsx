import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, PieChart, BarChart3 } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: '/expense',
      icon: Plus,
      label: 'Expense',
    },
    {
      path: '/income',
      icon: Plus,
      label: 'Income',
    },
    {
      path: '/budget',
      icon: PieChart,
      label: 'Budget',
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Reports',
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon
                size={24}
                className={`mb-1 ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;