export const defaultFinancialData = {
  creditScore: 740,
  creditUtilization: 28, // %
  missedEmis: 0,
  activeLoans: 2,
  monthlySalary: 75000,
  monthlyExpenses: 38000,
  monthlySavings: 20000,
  monthlyDebtPayments: 17000,
  totalDebt: 450000,
};

export const creditScoreHistory = [
  { month: 'Oct 2025', score: 685 },
  { month: 'Nov 2025', score: 692 },
  { month: 'Dec 2025', score: 710 },
  { month: 'Jan 2026', score: 725 },
  { month: 'Feb 2026', score: 732 },
  { month: 'Mar 2026', score: 740 },
];

export const incomeVsExpensesData = [
  { month: 'Oct', income: 70000, expenses: 42000, debt: 18000 },
  { month: 'Nov', income: 70000, expenses: 40000, debt: 18000 },
  { month: 'Dec', income: 72000, expenses: 44000, debt: 17000 },
  { month: 'Jan', income: 75000, expenses: 39000, debt: 17000 },
  { month: 'Feb', income: 75000, expenses: 37000, debt: 17000 },
  { month: 'Mar', income: 75000, expenses: 38000, debt: 17000 },
];

export const savingsProgressData = [
  { month: 'Oct', savings: 10000, cumulative: 80000 },
  { month: 'Nov', savings: 12000, cumulative: 92000 },
  { month: 'Dec', savings: 11000, cumulative: 103000 },
  { month: 'Jan', savings: 19000, cumulative: 122000 },
  { month: 'Feb', savings: 21000, cumulative: 143000 },
  { month: 'Mar', savings: 20000, cumulative: 163000 },
];
