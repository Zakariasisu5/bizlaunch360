import React, { useEffect } from 'react';
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4500, expenses: 2200 },
    { month: 'Feb', revenue: 5200, expenses: 2400 },
    { month: 'Mar', revenue: 4800, expenses: 2100 },
    { month: 'Apr', revenue: 6100, expenses: 2600 },
    { month: 'May', revenue: 7200, expenses: 2800 },
    { month: 'Jun', revenue: 8500, expenses: 3200 },
  ];

  const customerData = [
    { month: 'Jan', customers: 45 },
    { month: 'Feb', customers: 52 },
    { month: 'Mar', customers: 48 },
    { month: 'Apr', customers: 61 },
    { month: 'May', customers: 75 },
    { month: 'Jun', customers: 89 },
  ];

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
              <div className="text-2xl font-bold text-bizNeutral-900">$8,500</div>
              <div className="flex items-center text-xs text-bizSuccess">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18% from last month
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
              <div className="text-2xl font-bold text-bizNeutral-900">89</div>
              <div className="flex items-center text-xs text-bizSuccess">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% from last month
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
              <div className="text-2xl font-bold text-bizNeutral-900">12</div>
              <div className="flex items-center text-xs text-bizNeutral-500">
                <Clock className="h-3 w-3 mr-1" />
                3 today, 4 tomorrow
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
                <BarChart data={revenueData}>
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
                <LineChart data={customerData}>
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
