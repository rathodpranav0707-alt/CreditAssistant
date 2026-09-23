import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

export const CreditScoreChart = ({ currentScore = 740, data }) => {
  // If specific timeline data is passed, use it; otherwise generate a realistic
  // 6-month projected milestone trajectory starting from the user's real currentScore.
  const chartData = data || [
    { month: 'Current', score: currentScore, label: 'Actual Bureau Record' },
    { month: 'Month 1', score: Math.min(850, currentScore + 6), label: 'Projected' },
    { month: 'Month 2', score: Math.min(850, currentScore + 14), label: 'Projected' },
    { month: 'Month 3', score: Math.min(850, currentScore + 22), label: 'Projected' },
    { month: 'Month 4', score: Math.min(850, currentScore + 30), label: 'Projected' },
    { month: 'Month 6', score: Math.min(850, Math.max(755, currentScore + 40)), label: 'Target Milestone' },
  ];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis
            domain={[600, 850]}
            tickLine={false}
            stroke="#94a3b8"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)'
            }}
            formatter={(val, name, item) => [
              `${val} pts (${item.payload.label || 'Score'})`,
              'CIBIL Score'
            ]}
          />
          <ReferenceLine
            y={750}
            stroke="#059669"
            strokeDasharray="3 3"
            label={{ value: 'Excellent (750+ Target)', fill: '#059669', fontSize: 11, position: 'right' }}
          />
          <ReferenceLine
            y={currentScore}
            stroke="#0284c7"
            strokeDasharray="2 2"
            label={{ value: `Current (${currentScore})`, fill: '#0284c7', fontSize: 11, position: 'left' }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#0284c7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
