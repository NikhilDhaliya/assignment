import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;

const users = [
  { name: 'Admin User', email: 'admin@finance.com', password: 'admin123', role: 'ADMIN' },
  { name: 'Analyst User', email: 'analyst@finance.com', password: 'analyst123', role: 'ANALYST' },
  { name: 'Viewer User', email: 'viewer@finance.com', password: 'viewer123', role: 'VIEWER' },
];

async function main() {
  console.log('Seeding database...\n');

  // Clean existing data
  await prisma.record.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const createdUsers = [];
  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        status: 'ACTIVE',
      },
    });
    createdUsers.push(user);
  }

  // Create financial records (assigned to admin)
  const adminUser = createdUsers.find(u => u.role === 'ADMIN')!;

  const records = [
    { amount: 5000, type: 'INCOME', category: 'Salary', notes: 'Monthly salary - January', date: new Date('2026-01-15') },
    { amount: 5000, type: 'INCOME', category: 'Salary', notes: 'Monthly salary - February', date: new Date('2026-02-15') },
    { amount: 5000, type: 'INCOME', category: 'Salary', notes: 'Monthly salary - March', date: new Date('2026-03-15') },
    { amount: 1200, type: 'INCOME', category: 'Freelance', notes: 'Web development project', date: new Date('2026-01-20') },
    { amount: 800, type: 'INCOME', category: 'Freelance', notes: 'UI design work', date: new Date('2026-02-10') },
    { amount: 350, type: 'INCOME', category: 'Investments', notes: 'Dividend payout', date: new Date('2026-03-01') },
    { amount: 1500, type: 'EXPENSE', category: 'Rent', notes: 'Monthly rent - January', date: new Date('2026-01-05') },
    { amount: 1500, type: 'EXPENSE', category: 'Rent', notes: 'Monthly rent - February', date: new Date('2026-02-05') },
    { amount: 1500, type: 'EXPENSE', category: 'Rent', notes: 'Monthly rent - March', date: new Date('2026-03-05') },
    { amount: 150, type: 'EXPENSE', category: 'Utilities', notes: 'Electricity bill', date: new Date('2026-01-10') },
    { amount: 160, type: 'EXPENSE', category: 'Utilities', notes: 'Electricity bill', date: new Date('2026-02-10') },
    { amount: 450, type: 'EXPENSE', category: 'Groceries', notes: 'Monthly groceries', date: new Date('2026-01-12') },
    { amount: 480, type: 'EXPENSE', category: 'Groceries', notes: 'Monthly groceries', date: new Date('2026-02-12') },
    { amount: 500, type: 'EXPENSE', category: 'Groceries', notes: 'Monthly groceries', date: new Date('2026-03-12') },
    { amount: 100, type: 'EXPENSE', category: 'Transport', notes: 'Metro pass', date: new Date('2026-01-01') },
    { amount: 100, type: 'EXPENSE', category: 'Transport', notes: 'Metro pass', date: new Date('2026-02-01') },
    { amount: 200, type: 'EXPENSE', category: 'Entertainment', notes: 'Movie tickets and dinner', date: new Date('2026-01-25') },
    { amount: 75, type: 'EXPENSE', category: 'Healthcare', notes: 'Doctor visit', date: new Date('2026-02-20') },
    { amount: 2000, type: 'INCOME', category: 'Freelance', notes: 'Mobile app project', date: new Date('2026-03-20') },
    { amount: 300, type: 'EXPENSE', category: 'Education', notes: 'Online course subscription', date: new Date('2026-03-10') },
  ];

  for (const record of records) {
    await prisma.record.create({
      data: {
        ...record,
        createdById: adminUser.id,
      },
    });
  }

  // Print credentials table
  console.log('Database seeded successfully!\n');
  console.log('┌────────────────────────────────────────────────────────────────┐');
  console.log('│                    LOGIN CREDENTIALS                          │');
  console.log('├──────────┬────────────────────────┬──────────────┬────────────┤');
  console.log('│ Role     │ Email                  │ Password     │ Status     │');
  console.log('├──────────┼────────────────────────┼──────────────┼────────────┤');
  for (const user of users) {
    const role = user.role.padEnd(8);
    const email = user.email.padEnd(22);
    const password = user.password.padEnd(12);
    console.log(`│ ${role} │ ${email} │ ${password} │ ACTIVE     │`);
  }
  console.log('└──────────┴────────────────────────┴──────────────┴────────────┘');
  console.log(`\nCreated ${users.length} users and ${records.length} financial records.\n`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
