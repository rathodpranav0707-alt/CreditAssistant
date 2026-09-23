export const mockRecommendationsList = [
  {
    id: 'rec-1',
    category: 'Credit Health',
    title: 'Keep Credit Card Utilization Under 30%',
    priority: 'High',
    impact: '+15 to 25 pts',
    description: 'Your current credit card utilization is around 28%. Aim to keep it below 30% on each billing cycle or request a credit limit increase to lower your ratio automatically.',
    actionPlan: [
      'Pay off high balances before the billing statement generation date.',
      'Request credit limit enhancement from your existing banks without hard inquiries.',
      'Distribute expenses across multiple cards if you have more than one.'
    ]
  },
  {
    id: 'rec-2',
    category: 'Repayment Discipline',
    title: 'Zero Missed EMI Payments Guarantee',
    priority: 'Critical',
    impact: 'Prevents -50 to -80 pts drops',
    description: 'A single 30-day late payment can stay on your CIBIL/Experian report for up to 36 months. Maintain automated autopay on all active personal and auto loans.',
    actionPlan: [
      'Enable e-NACH/Auto-debit mandate 3 days ahead of EMI due dates.',
      'Maintain an EMI buffer account with at least 2 months of loan EMIs.',
      'Set calendar reminders 5 days before each installment cycle.'
    ]
  },
  {
    id: 'rec-3',
    category: 'Emergency Cushion',
    title: 'Build 6-Month Emergency Liquid Reserves',
    priority: 'Medium',
    impact: 'Financial Stability',
    description: 'Based on your monthly expenses and debt commitments, an optimal emergency reserve should be approximately 3.3 to 3.5 Lakhs in liquid instruments.',
    actionPlan: [
      'Direct at least 20% of monthly savings towards liquid mutual funds or high-interest sweep-in FDs.',
      'Keep 1 month of cash equivalents readily accessible via UPI/ATM.',
      'Review and replenish the buffer annually as recurring expenses grow.'
    ]
  },
  {
    id: 'rec-4',
    category: 'Debt Reduction',
    title: 'Accelerate High-Interest Debt Repayment',
    priority: 'High',
    impact: 'Saves Interest & Improves DTI',
    description: 'Your current Debt-to-Income ratio is within moderate limits. Prepaying higher APR debts will free up monthly disposable cash flow faster.',
    actionPlan: [
      'Use the Debt Avalanche approach: channel spare bonuses towards the loan with the highest interest rate.',
      'Inquire with your bank about loan balance transfer or lower interest restructuring.',
      'Avoid taking additional personal or retail consumer durable loans.'
    ]
  },
  {
    id: 'rec-5',
    category: 'Wealth Accumulation',
    title: 'Maintain Systematic Investment Discipline',
    priority: 'Medium',
    impact: 'Long-term Growth',
    description: 'Your monthly savings rate of over 26% is commendable. Ensure idle savings are not eroded by inflation in low-yield savings accounts.',
    actionPlan: [
      'Automate monthly SIPs in diversified index or large-and-midcap mutual funds.',
      'Review life and health insurance coverage so savings are never drained by medical emergencies.',
      'Increase SIP contributions by 10% annually with salary increments.'
    ]
  }
];
