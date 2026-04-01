export interface SummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalRecords: number;
}

export interface CategorySummary {
  category: string;
  totalIncome: number;
  totalExpenses: number;
  net: number;
  count: number;
}

export interface MonthlyTrend {
  month: string; // YYYY-MM
  income: number;
  expenses: number;
  net: number;
}

export interface RecentRecord {
  id: string;
  amount: number;
  type: string;
  category: string;
  date: Date;
  notes: string | null;
  createdBy: { name: string };
}
