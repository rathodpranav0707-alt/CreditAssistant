import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { formatINR } from '../services/calculations';

export const IncomeExpenseChart = ({ salary = 75000, expenses = 38000, debt = 17000, savings = 20000, data }) => {
  // If historical/series data is provided, use it. Otherwise, build an honest,
  // clearly labeled comparison of "Your Current Monthly Flow" vs "50-30-20 Target Allocation".
  const chartData = data || [
    {
      category: 'Your Current Flow',
      LivingExpenses: expenses,
      DebtEMIs: debt,
      SavingsAdded: savings,
    },
    {
      category: '50-30-20 Target',
      LivingExpenses: Math.round(salary * 0.50),
      DebtEMIs: Math.round(salary * 0.30),
      SavingsAdded: Math.round(salary * 0.20),
    }
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="category" tickLine={false} stroke="#94a3b8" fontSize={12} />
          <YAxis
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)'
            }}
            formatter={(value, name) => [
              formatINR(value),
              name === 'LivingExpenses' ? 'Living Expenses' :
              name === 'DebtEMIs' ? 'Debt Payments / EMIs' :
              name === 'SavingsAdded' ? 'Monthly Savings & Investments' : name
            ]}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="LivingExpenses" fill="#f59e0b" name="Living Expenses" radius={[4, 4, 0, 0]} />
          <Bar dataKey="DebtEMIs" fill="#ef4444" name="Debt Payments / EMIs" radius={[4, 4, 0, 0]} />
          <Bar dataKey="SavingsAdded" fill="#10b981" name="Savings Added" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
