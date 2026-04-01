import { prisma } from '../../lib/prisma.js';
import type { SummaryResponse, CategorySummary, MonthlyTrend, RecentRecord } from './dashboard.types.js';

export async function getSummary(): Promise<SummaryResponse> {
  const [incomeResult, expenseResult, totalRecords] = await Promise.all([
    prisma.record.aggregate({
      where: { type: 'INCOME', isDeleted: false },
      _sum: { amount: true },
    }),
    prisma.record.aggregate({
      where: { type: 'EXPENSE', isDeleted: false },
      _sum: { amount: true },
    }),
    prisma.record.count({
      where: { isDeleted: false },
    }),
  ]);

  const totalIncome = incomeResult._sum.amount ?? 0;
  const totalExpenses = expenseResult._sum.amount ?? 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    totalRecords,
  };
}

export async function getCategorySummary(): Promise<CategorySummary[]> {
  const records = await prisma.record.findMany({
    where: { isDeleted: false },
    select: { category: true, type: true, amount: true },
  });

  const categoryMap = new Map<string, CategorySummary>();

  for (const record of records) {
    const existing = categoryMap.get(record.category) || {
      category: record.category,
      totalIncome: 0,
      totalExpenses: 0,
      net: 0,
      count: 0,
    };

    if (record.type === 'INCOME') {
      existing.totalIncome += record.amount;
    } else {
      existing.totalExpenses += record.amount;
    }

    existing.net = existing.totalIncome - existing.totalExpenses;
    existing.count += 1;

    categoryMap.set(record.category, existing);
  }

  return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
}

export async function getMonthlyTrends(): Promise<MonthlyTrend[]> {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const records = await prisma.record.findMany({
    where: {
      isDeleted: false,
      date: { gte: twelveMonthsAgo },
    },
    select: { date: true, type: true, amount: true },
    orderBy: { date: 'asc' },
  });

  const monthMap = new Map<string, MonthlyTrend>();

  for (const record of records) {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthMap.get(monthKey) || {
      month: monthKey,
      income: 0,
      expenses: 0,
      net: 0,
    };

    if (record.type === 'INCOME') {
      existing.income += record.amount;
    } else {
      existing.expenses += record.amount;
    }

    existing.net = existing.income - existing.expenses;
    monthMap.set(monthKey, existing);
  }

  return Array.from(monthMap.values());
}

export async function getRecentActivity(count: number = 10): Promise<RecentRecord[]> {
  return prisma.record.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
      createdBy: { select: { name: true } },
    },
    orderBy: { date: 'desc' },
    take: count,
  });
}
