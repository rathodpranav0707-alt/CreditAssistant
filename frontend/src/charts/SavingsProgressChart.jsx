import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { formatINR } from '../services/calculations';

export const SavingsProgressChart = ({ monthlySavings = 20000, data }) => {
  // If static series data is given, use it. Otherwise, compute a clear 6-month
  // projected wealth accumulation based on the user's real monthly savings contribution.
  const chartData = data || [
    { month: 'Month 1', savings: monthlySavings, cumulative: monthlySavings },
    { month: 'Month 2', savings: monthlySavings, cumulative: Math.round(monthlySavings * 2 * 1.006) },
    { month: 'Month 3', savings: monthlySavings, cumulative: Math.round(monthlySavings * 3 * 1.012) },
    { month: 'Month 4', savings: monthlySavings, cumulative: Math.round(monthlySavings * 4 * 1.018) },
    { month: 'Month 5', savings: monthlySavings, cumulative: Math.round(monthlySavings * 5 * 1.025) },
    { month: 'Month 6', savings: monthlySavings, cumulative: Math.round(monthlySavings * 6 * 1.032) },
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={12} />
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
            formatter={(val, name) => [
              formatINR(val),
              name === 'cumulative' ? 'Projected Corpus' : 'Monthly Added'
            ]}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            type="monotone"
            dataKey="cumulative"
            name="Projected Corpus"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: '#2563eb' }}
          />
          <Line
            type="monotone"
            dataKey="savings"
            name="Monthly Contribution"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
