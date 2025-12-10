import jsPDF from 'jspdf';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  dueDate: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ReportData {
  invoices: Invoice[];
  expenses: Expense[];
  businessName?: string;
  period?: string;
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const generateIncomeStatement = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Income Statement', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.businessName || 'Business Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.text(`Period: ${data.period || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' });

  // Revenue Section
  yPos += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Revenue', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const paidInvoices = data.invoices.filter(inv => inv.status === 'paid');
  let totalRevenue = 0;

  paidInvoices.forEach((invoice) => {
    pdf.text(invoice.customer, 25, yPos);
    pdf.text(formatCurrency(invoice.amount), pageWidth - 25, yPos, { align: 'right' });
    totalRevenue += invoice.amount;
    yPos += 7;
  });

  if (paidInvoices.length === 0) {
    pdf.text('No revenue recorded', 25, yPos);
    yPos += 7;
  }

  // Revenue Total
  yPos += 5;
  pdf.setDrawColor(0);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Revenue', 25, yPos);
  pdf.text(formatCurrency(totalRevenue), pageWidth - 25, yPos, { align: 'right' });

  // Expenses Section
  yPos += 20;
  pdf.setFontSize(14);
  pdf.text('Expenses', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  data.expenses.forEach(expense => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
  });

  let totalExpenses = 0;
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    pdf.text(category, 25, yPos);
    pdf.text(formatCurrency(amount), pageWidth - 25, yPos, { align: 'right' });
    totalExpenses += amount;
    yPos += 7;
  });

  if (Object.keys(expensesByCategory).length === 0) {
    pdf.text('No expenses recorded', 25, yPos);
    yPos += 7;
  }

  // Expenses Total
  yPos += 5;
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Expenses', 25, yPos);
  pdf.text(formatCurrency(totalExpenses), pageWidth - 25, yPos, { align: 'right' });

  // Net Income
  yPos += 15;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 2;
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  const netIncome = totalRevenue - totalExpenses;
  pdf.setFontSize(12);
  pdf.text('Net Income', 25, yPos);
  pdf.setTextColor(netIncome >= 0 ? 0 : 255, netIncome >= 0 ? 128 : 0, 0);
  pdf.text(formatCurrency(netIncome), pageWidth - 25, yPos, { align: 'right' });

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

  pdf.save('income-statement.pdf');
};

export const generateExpenseReport = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Expense Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.businessName || 'Business Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.text(`Period: ${data.period || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' });

  // Table Header
  yPos += 20;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
  pdf.text('Date', 25, yPos);
  pdf.text('Description', 55, yPos);
  pdf.text('Category', 120, yPos);
  pdf.text('Amount', pageWidth - 25, yPos, { align: 'right' });

  // Table Rows
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  let totalExpenses = 0;

  data.expenses.forEach((expense, index) => {
    if (yPos > pdf.internal.pageSize.getHeight() - 30) {
      pdf.addPage();
      yPos = 20;
    }

    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(20, yPos - 4, pageWidth - 40, 8, 'F');
    }

    pdf.text(formatDate(expense.date), 25, yPos);
    pdf.text(expense.description.substring(0, 25), 55, yPos);
    pdf.text(expense.category, 120, yPos);
    pdf.text(formatCurrency(expense.amount), pageWidth - 25, yPos, { align: 'right' });
    totalExpenses += expense.amount;
    yPos += 8;
  });

  if (data.expenses.length === 0) {
    pdf.text('No expenses recorded', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  }

  // Total
  yPos += 10;
  pdf.setDrawColor(0);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Expenses', 25, yPos);
  pdf.text(formatCurrency(totalExpenses), pageWidth - 25, yPos, { align: 'right' });

  // Summary by Category
  yPos += 25;
  pdf.setFontSize(14);
  pdf.text('Summary by Category', 20, yPos);
  yPos += 10;

  const expensesByCategory: Record<string, number> = {};
  data.expenses.forEach(expense => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
  });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]).forEach(([category, amount]) => {
    const percentage = ((amount / totalExpenses) * 100).toFixed(1);
    pdf.text(category, 25, yPos);
    pdf.text(`${formatCurrency(amount)} (${percentage}%)`, pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  });

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

  pdf.save('expense-report.pdf');
};

export const generateTaxSummary = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Tax Summary Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.businessName || 'Business Report', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 8;
  pdf.setFontSize(10);
  pdf.text(`Tax Year: ${data.period || new Date().getFullYear()}`, pageWidth / 2, yPos, { align: 'center' });

  // Calculate totals
  const paidInvoices = data.invoices.filter(inv => inv.status === 'paid');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Gross Income Section
  yPos += 25;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Gross Income', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Total Sales/Revenue', 25, yPos);
  pdf.text(formatCurrency(totalRevenue), pageWidth - 25, yPos, { align: 'right' });

  // Deductible Expenses Section
  yPos += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Deductible Expenses', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Common deductible categories
  const deductibleCategories = ['Rent', 'Software', 'Marketing', 'Office Supplies', 'Travel', 'Utilities', 'Insurance', 'Professional Services'];
  const expensesByCategory: Record<string, number> = {};
  
  data.expenses.forEach(expense => {
    expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
  });

  deductibleCategories.forEach(category => {
    if (expensesByCategory[category]) {
      pdf.text(category, 25, yPos);
      pdf.text(formatCurrency(expensesByCategory[category]), pageWidth - 25, yPos, { align: 'right' });
      yPos += 7;
    }
  });

  // Other expenses
  const otherExpenses = Object.entries(expensesByCategory)
    .filter(([cat]) => !deductibleCategories.includes(cat))
    .reduce((sum, [, amount]) => sum + amount, 0);
  
  if (otherExpenses > 0) {
    pdf.text('Other Business Expenses', 25, yPos);
    pdf.text(formatCurrency(otherExpenses), pageWidth - 25, yPos, { align: 'right' });
    yPos += 7;
  }

  // Total Deductions
  yPos += 5;
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Deductible Expenses', 25, yPos);
  pdf.text(formatCurrency(totalExpenses), pageWidth - 25, yPos, { align: 'right' });

  // Taxable Income
  yPos += 20;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 2;
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(12);
  pdf.text('Net Taxable Income', 25, yPos);
  pdf.setTextColor(netIncome >= 0 ? 0 : 255, netIncome >= 0 ? 0 : 0, 0);
  pdf.text(formatCurrency(netIncome), pageWidth - 25, yPos, { align: 'right' });

  // Estimated Tax (simplified)
  yPos += 20;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Estimated Tax Liability', 20, yPos);
  
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const estimatedSelfEmploymentTax = Math.max(0, netIncome * 0.153);
  const estimatedIncomeTax = Math.max(0, netIncome * 0.22); // Simplified 22% bracket
  
  pdf.text('Self-Employment Tax (15.3%)', 25, yPos);
  pdf.text(formatCurrency(estimatedSelfEmploymentTax), pageWidth - 25, yPos, { align: 'right' });
  yPos += 7;
  
  pdf.text('Estimated Income Tax (~22%)', 25, yPos);
  pdf.text(formatCurrency(estimatedIncomeTax), pageWidth - 25, yPos, { align: 'right' });
  yPos += 10;
  
  pdf.line(20, yPos, pageWidth - 20, yPos);
  yPos += 7;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Estimated Tax', 25, yPos);
  pdf.text(formatCurrency(estimatedSelfEmploymentTax + estimatedIncomeTax), pageWidth - 25, yPos, { align: 'right' });

  // Disclaimer
  yPos += 25;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  const disclaimer = 'This is an estimated summary for informational purposes only. Please consult a qualified tax professional for accurate tax advice.';
  const lines = pdf.splitTextToSize(disclaimer, pageWidth - 40);
  pdf.text(lines, 20, yPos);

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

  pdf.save('tax-summary.pdf');
};
