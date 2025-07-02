
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Trash2,
  Filter,
  Download,
  UserPlus
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive' | 'lead' | 'prospect';
  totalSpent: number;
  lastContact: string;
  notes?: string;
}

const CRM = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'lead' | 'prospect'>('all');

  // Mock customer data
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc',
      address: '123 Main St, City, State 12345',
      status: 'active',
      totalSpent: 2500,
      lastContact: '2024-01-15',
      notes: 'Interested in premium package'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543',
      company: 'Marketing Pro',
      status: 'lead',
      totalSpent: 0,
      lastContact: '2024-01-10',
      notes: 'Responded to email campaign'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@business.com',
      phone: '+1 (555) 456-7890',
      status: 'prospect',
      totalSpent: 1200,
      lastContact: '2024-01-08'
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily@startup.com',
      phone: '+1 (555) 321-0987',
      company: 'Innovation Labs',
      status: 'inactive',
      totalSpent: 800,
      lastContact: '2023-12-20'
    }
  ]);

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'bg-bizSuccess text-white';
      case 'lead': return 'bg-bizPrimary text-white';
      case 'prospect': return 'bg-bizWarning text-white';
      case 'inactive': return 'bg-bizNeutral-400 text-white';
      default: return 'bg-bizNeutral-400 text-white';
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const newLeads = customers.filter(c => c.status === 'lead').length;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-bizNeutral-900">Customer Management</h1>
            <p className="text-bizNeutral-600 mt-1">Manage your customers and track relationships</p>
          </div>
          <Button className="btn-primary">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-bizPrimary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{totalCustomers}</div>
              <p className="text-xs text-bizNeutral-500">All time</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-bizSuccess" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{activeCustomers}</div>
              <p className="text-xs text-bizSuccess">Currently active</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                Total Revenue
              </CardTitle>
              <Users className="h-4 w-4 text-bizWarning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-bizNeutral-500">From all customers</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">
                New Leads
              </CardTitle>
              <Users className="h-4 w-4 text-bizAccent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{newLeads}</div>
              <p className="text-xs text-bizAccent">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>Manage and track all your customers</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bizNeutral-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-3 py-2 border border-bizNeutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bizPrimary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Customer List */}
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="border border-bizNeutral-200 rounded-lg p-4 hover:shadow-soft transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-bizNeutral-900">{customer.name}</h3>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-bizNeutral-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {customer.phone}
                        </div>
                        {customer.company && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {customer.company}
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {customer.address}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-bizNeutral-600">
                          Total Spent: <span className="font-medium text-bizNeutral-900">${customer.totalSpent.toLocaleString()}</span>
                        </span>
                        <span className="text-bizNeutral-600">
                          Last Contact: <span className="font-medium text-bizNeutral-900">{customer.lastContact}</span>
                        </span>
                      </div>
                      
                      {customer.notes && (
                        <div className="mt-2 text-sm text-bizNeutral-600">
                          <span className="font-medium">Notes:</span> {customer.notes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-bizError hover:text-bizError">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-bizNeutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-bizNeutral-900 mb-2">No customers found</h3>
                <p className="text-bizNeutral-600">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRM;
