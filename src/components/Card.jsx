import React from 'react';

const Card = ({ title, value, icon: Icon, trend, trendValue, className = '' }) => {
  return (
    <div className={`card hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                from last week
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

