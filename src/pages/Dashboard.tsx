import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    monthlyRevenue: 0,
    totalCustomers: 0,
    appointmentsThisWeek: 0,
    revenueData: [] as any[],
    customerData: [] as any[]
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadDashboardData();
    }
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [invoicesRes, customersRes, appointmentsRes, expensesRes] = await Promise.all([
        supabase.from('invoices').select('amount, status, invoice_date'),
        supabase.from('customers').select('id, created_at'),
        supabase.from('appointments').select('appointment_date'),
        supabase.from('expenses').select('amount, expense_date')
      ]);

      // Calculate monthly revenue (paid invoices)
      const paidInvoices = (invoicesRes.data || []).filter(inv => inv.status === 'paid');
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = paidInvoices
        .filter(inv => new Date(inv.invoice_date).getMonth() === currentMonth)
        .reduce((sum, inv) => sum + Number(inv.amount), 0);

      // Get total customers
      const totalCustomers = customersRes.data?.length || 0;

      // Calculate appointments this week
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const appointmentsThisWeek = (appointmentsRes.data || []).filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate >= today && aptDate <= weekFromNow;
      }).length;

      // Generate revenue data for last 6 months
      const revenueData = [];
      const expenseData = expensesRes.data || [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const monthRevenue = paidInvoices
          .filter(inv => {
            const invDate = new Date(inv.invoice_date);
            return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, inv) => sum + Number(inv.amount), 0);

        const monthExpenses = expenseData
          .filter(exp => {
            const expDate = new Date(exp.expense_date);
            return expDate.getMonth() === date.getMonth() && expDate.getFullYear() === date.getFullYear();
          })
          .reduce((sum, exp) => sum + Number(exp.amount), 0);

        revenueData.push({
          month: monthName,
          revenue: monthRevenue,
          expenses: monthExpenses
        });
      }

      // Generate customer growth data
      const customerData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        const customersUntilMonth = (customersRes.data || []).filter(c => {
          const createdDate = new Date(c.created_at);
          return createdDate <= date;
        }).length;

        customerData.push({
          month: monthName,
          customers: customersUntilMonth
        });
      }

      setDashboardData({
        monthlyRevenue,
        totalCustomers,
        appointmentsThisWeek,
        revenueData,
        customerData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const quickActions = [
    { title: 'Create Invoice', icon: DollarSign, href: '/finance', color: 'bg-bizSuccess' },
    { title: 'Add Customer', icon: Users, href: '/crm', color: 'bg-bizPrimary' },
    { title: 'Schedule Meeting', icon: Calendar, href: '/appointments', color: 'bg-bizAccent' },
    { title: 'Business Plan', icon: FileText, href: '/business-plan', color: 'bg-bizWarning' },
  ];

  const recentActivities = [
    { title: 'Invoice #001 paid', time: '2 hours ago', type: 'payment' },
    { title: 'New customer: Jane Smith', time: '4 hours ago', type: 'customer' },
    { title: 'Appointment with John Doe', time: '1 day ago', type: 'appointment' },
    { title: 'Business plan updated', time: '2 days ago', type: 'plan' },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-bizSuccess" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">${dashboardData.monthlyRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-bizNeutral-500">
                Current month
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-bizPrimary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{dashboardData.totalCustomers}</div>
              <div className="flex items-center text-xs text-bizNeutral-500">
                All time
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Appointments This Week
              </CardTitle>
              <Calendar className="h-4 w-4 text-bizAccent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{dashboardData.appointmentsThisWeek}</div>
              <div className="flex items-center text-xs text-bizNeutral-500">
                <Clock className="h-3 w-3 mr-1" />
                Next 7 days
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Growth Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-bizWarning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">24%</div>
              <div className="flex items-center text-xs text-bizSuccess">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Quarterly growth
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Expenses</CardTitle>
              <CardDescription>Monthly comparison over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#10B981" />
                  <Bar dataKey="expenses" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>Total customers acquired over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.customerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to help you manage your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center space-y-2 card-hover border-2"
                        onClick={() => navigate(action.href)}
                      >
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-bizSuccess" />}
                      {activity.type === 'customer' && <Users className="h-4 w-4 text-bizPrimary" />}
                      {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-bizAccent" />}
                      {activity.type === 'plan' && <FileText className="h-4 w-4 text-bizWarning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-bizNeutral-900">{activity.title}</p>
                      <p className="text-xs text-bizNeutral-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Health Score */}
        <Card>
          <CardHeader>
            <CardTitle>Business Health Score</CardTitle>
            <CardDescription>Overall assessment of your business performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-bizNeutral-900">Overall Score: 85/100</span>
                <span className="text-sm text-bizSuccess font-medium">Excellent</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-bizSuccess/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-bizSuccess mx-auto mb-2" />
                  <div className="font-semibold text-bizNeutral-900">Revenue Growth</div>
                  <div className="text-sm text-bizNeutral-600">Strong upward trend</div>
                </div>
                
                <div className="text-center p-4 bg-bizSuccess/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-bizSuccess mx-auto mb-2" />
                  <div className="font-semibold text-bizNeutral-900">Customer Retention</div>
                  <div className="text-sm text-bizNeutral-600">Above industry average</div>
                </div>
                
                <div className="text-center p-4 bg-bizWarning/10 rounded-lg">
                  <Clock className="h-8 w-8 text-bizWarning mx-auto mb-2" />
                  <div className="font-semibold text-bizNeutral-900">Cash Flow</div>
                  <div className="text-sm text-bizNeutral-600">Needs attention</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
