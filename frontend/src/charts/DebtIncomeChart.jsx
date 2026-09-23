import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatINR } from '../services/calculations';

export const DebtIncomeChart = ({ salary, expenses, debt, savings }) => {
  const data = [
    { name: 'Living Expenses', value: Number(expenses) || 0, color: '#f59e0b' },
    { name: 'Debt Payments / EMIs', value: Number(debt) || 0, color: '#ef4444' },
    { name: 'Savings & Surplus', value: Number(savings) || 0, color: '#10b981' },
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)'
            }}
            formatter={(val) => [formatINR(val), 'Allocation']}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
