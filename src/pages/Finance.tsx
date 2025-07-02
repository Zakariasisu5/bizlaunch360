
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Plus, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Send,
  Download,
  Eye,
  Edit,
  Trash2,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
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

const Finance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: 'INV-001',
      customer: 'Acme Corp',
      amount: 2500,
      status: 'paid',
      date: '2024-01-15',
      dueDate: '2024-02-15'
    },
    {
      id: '2',
      number: 'INV-002', 
      customer: 'Tech Solutions',
      amount: 1800,
      status: 'sent',
      date: '2024-01-20',
      dueDate: '2024-02-20'
    },
    {
      id: '3',
      number: 'INV-003',
      customer: 'StartupXYZ',
      amount: 3200,
      status: 'overdue',
      date: '2023-12-10',
      dueDate: '2024-01-10'
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Office rent',
      amount: 1200,
      category: 'Rent',
      date: '2024-01-01'
    },
    {
      id: '2',
      description: 'Software licenses',
      amount: 450,
      category: 'Software',
      date: '2024-01-05'
    },
    {
      id: '3',
      description: 'Marketing campaign',
      amount: 800,
      category: 'Marketing',
      date: '2024-01-10'
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    amount: '',
    description: '',
    dueDate: ''
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: ''
  });

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueRevenue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-bizSuccess text-white';
      case 'sent': return 'bg-bizPrimary text-white';
      case 'overdue': return 'bg-bizError text-white';
      case 'draft': return 'bg-bizNeutral-200 text-bizNeutral-800';
      default: return 'bg-bizNeutral-200 text-bizNeutral-800';
    }
  };

  const handleCreateInvoice = () => {
    if (!newInvoice.customer || !newInvoice.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const invoice: Invoice = {
      id: Date.now().toString(),
      number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      customer: newInvoice.customer,
      amount: parseFloat(newInvoice.amount),
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate
    };

    setInvoices([invoice, ...invoices]);
    setNewInvoice({ customer: '', amount: '', description: '', dueDate: '' });
    toast.success('Invoice created successfully!');
  };

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date || new Date().toISOString().split('T')[0]
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '', category: '', date: '' });
    toast.success('Expense added successfully!');
  };

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'sent' as const } : inv
    ));
    toast.success('Invoice sent successfully!');
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'paid' as const } : inv
    ));
    toast.success('Invoice marked as paid!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bizNeutral-900">Finance & Invoicing</h1>
            <p className="text-bizNeutral-600 mt-2">Manage your invoices, expenses, and financial health</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-success">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a new business expense</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-description">Description</Label>
                    <Input
                      id="expense-description"
                      placeholder="Enter expense description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Software">Software</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date</Label>
                    <Input
                      id="expense-date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddExpense} className="w-full btn-primary">
                    Add Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>Create and send a professional invoice</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input
                      id="customer"
                      placeholder="Enter customer name"
                      value={newInvoice.customer}
                      onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Invoice description or line items"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateInvoice} className="w-full btn-primary">
                    Create Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-bizNeutral-600">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-bizSuccess" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bizNeutral-900">${totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-bizSuccess">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-bizNeutral-600">Pending Revenue</CardTitle>
                  <Calendar className="h-4 w-4 text-bizPrimary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bizNeutral-900">${pendingRevenue.toLocaleString()}</div>
                  <div className="text-xs text-bizNeutral-500">
                    {invoices.filter(inv => inv.status === 'sent').length} pending invoices
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-bizNeutral-600">Overdue</CardTitle>
                  <TrendingDown className="h-4 w-4 text-bizError" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bizError">${overdueRevenue.toLocaleString()}</div>
                  <div className="text-xs text-bizNeutral-500">
                    {invoices.filter(inv => inv.status === 'overdue').length} overdue invoices
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-bizNeutral-600">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-bizWarning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-bizNeutral-900">${totalExpenses.toLocaleString()}</div>
                  <div className="text-xs text-bizNeutral-500">
                    {expenses.length} expenses this month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest invoice activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-bizNeutral-900">{invoice.number}</div>
                          <div className="text-sm text-bizNeutral-600">{invoice.customer}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-bizNeutral-900">${invoice.amount}</div>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                  <CardDescription>Your latest business expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expenses.slice(0, 5).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-bizNeutral-900">{expense.description}</div>
                          <div className="text-sm text-bizNeutral-600">{expense.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-bizError">-${expense.amount}</div>
                          <div className="text-xs text-bizNeutral-500">{expense.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
                <CardDescription>Manage your invoices and track payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-bizNeutral-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-bizPrimary" />
                        <div>
                          <div className="font-medium text-bizNeutral-900">{invoice.number}</div>
                          <div className="text-sm text-bizNeutral-600">{invoice.customer}</div>
                          <div className="text-xs text-bizNeutral-500">Due: {invoice.dueDate}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium text-bizNeutral-900">${invoice.amount}</div>
                          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button size="sm" onClick={() => handleSendInvoice(invoice.id)}>
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button size="sm" onClick={() => handleMarkAsPaid(invoice.id)} className="btn-success">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
                <CardDescription>Track and categorize your business expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-4 border border-bizNeutral-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-bizError/10 rounded-lg">
                          <DollarSign className="h-6 w-6 text-bizError" />
                        </div>
                        <div>
                          <div className="font-medium text-bizNeutral-900">{expense.description}</div>
                          <div className="text-sm text-bizNeutral-600">{expense.category}</div>
                          <div className="text-xs text-bizNeutral-500">{expense.date}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="font-medium text-bizError">-${expense.amount}</div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profit & Loss</CardTitle>
                  <CardDescription>Current month financial summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-bizNeutral-600">Total Revenue</span>
                      <span className="font-medium text-bizSuccess">+${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-bizNeutral-600">Total Expenses</span>
                      <span className="font-medium text-bizError">-${totalExpenses.toLocaleString()}</span>
                    </div>
                    <hr className="border-bizNeutral-200" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Net Profit</span>
                      <span className={totalRevenue - totalExpenses > 0 ? 'text-bizSuccess' : 'text-bizError'}>
                        ${(totalRevenue - totalExpenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow</CardTitle>
                  <CardDescription>Money coming in and going out</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-bizNeutral-600">Cash In (Paid Invoices)</span>
                      <span className="font-medium text-bizSuccess">+${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-bizNeutral-600">Cash Out (Expenses)</span>
                      <span className="font-medium text-bizError">-${totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-bizNeutral-600">Pending (Unpaid Invoices)</span>
                      <span className="font-medium text-bizWarning">${(pendingRevenue + overdueRevenue).toLocaleString()}</span>
                    </div>
                    <hr className="border-bizNeutral-200" />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Net Cash Flow</span>
                      <span className={totalRevenue - totalExpenses > 0 ? 'text-bizSuccess' : 'text-bizError'}>
                        ${(totalRevenue - totalExpenses).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download detailed financial reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Income Statement
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Expense Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Tax Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Finance;
