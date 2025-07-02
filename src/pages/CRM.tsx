
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Plus, 
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  UserPlus,
  Filter,
  Star,
  Building
} from 'lucide-react';
import { toast } from 'sonner';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive' | 'lead' | 'prospect';
  value: number;
  lastContact: string;
  notes: string;
  tags: string[];
}

const CRM = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      phone: '+1 (555) 123-4567',
      company: 'Acme Corp',
      address: '123 Business St, City, State 12345',
      status: 'active',
      value: 15000,
      lastContact: '2024-01-20',
      notes: 'Great client, always pays on time. Interested in expanding services.',
      tags: ['VIP', 'Recurring']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@techsolutions.com',
      phone: '+1 (555) 987-6543',
      company: 'Tech Solutions Inc',
      address: '456 Innovation Ave, Tech City, TC 67890',
      status: 'active',
      value: 8500,
      lastContact: '2024-01-18',
      notes: 'Startup client with high growth potential. Very tech-savvy.',
      tags: ['Startup', 'High Potential']
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@startup.com',
      phone: '+1 (555) 456-7890',
      company: 'StartupXYZ',
      address: '789 Entrepreneur Blvd, Startup Valley, SV 54321',
      status: 'lead',
      value: 0,
      lastContact: '2024-01-15',
      notes: 'Potential client, needs follow-up on proposal.',
      tags: ['New Lead', 'Proposal Sent']
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily@consulting.com',
      phone: '+1 (555) 321-0987',
      company: 'Wilson Consulting',
      address: '321 Professional Plaza, Business District, BD 98765',
      status: 'prospect',
      value: 12000,
      lastContact: '2024-01-10',
      notes: 'Interested in our premium package. Schedule follow-up call.',
      tags: ['Premium Interest', 'Follow-up']
    }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'lead' as const,
    notes: '',
    tags: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-bizSuccess text-white';
      case 'inactive': return 'bg-bizNeutral-400 text-white';
      case 'lead': return 'bg-bizPrimary text-white';
      case 'prospect': return 'bg-bizWarning text-white';
      default: return 'bg-bizNeutral-200 text-bizNeutral-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Please fill in name and email fields');
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      company: newCustomer.company,
      address: newCustomer.address,
      status: newCustomer.status,
      value: 0,
      lastContact: new Date().toISOString().split('T')[0],
      notes: newCustomer.notes,
      tags: newCustomer.tags ? newCustomer.tags.split(',').map(tag => tag.trim()) : []
    };

    setCustomers([customer, ...customers]);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      status: 'lead',
      notes: '',
      tags: ''
    });
    toast.success('Customer added successfully!');
  };

  const handleUpdateStatus = (customerId: string, newStatus: Customer['status']) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus, lastContact: new Date().toISOString().split('T')[0] } : customer
    ));
    toast.success(`Customer status updated to ${newStatus}!`);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(customer => customer.id !== customerId));
    toast.success('Customer deleted successfully!');
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalValue = customers.filter(c => c.status === 'active').reduce((sum, c) => sum + c.value, 0);
  const leads = customers.filter(c => c.status === 'lead').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bizNeutral-900">Customer Management</h1>
            <p className="text-bizNeutral-600 mt-2">Manage your customer relationships and track interactions</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-primary mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Add a new customer to your CRM system</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Name *</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email *</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    placeholder="+1 (555) 123-4567"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-company">Company</Label>
                  <Input
                    id="customer-company"
                    placeholder="Company name"
                    value={newCustomer.company}
                    onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Input
                    id="customer-address"
                    placeholder="Full address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-status">Status</Label>
                  <Select value={newCustomer.status} onValueChange={(value: Customer['status']) => setNewCustomer({ ...newCustomer, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="prospect">Prospect</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-tags">Tags (comma-separated)</Label>
                  <Input
                    id="customer-tags"
                    placeholder="VIP, Recurring, High Value"
                    value={newCustomer.tags}
                    onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="customer-notes">Notes</Label>
                  <Textarea
                    id="customer-notes"
                    placeholder="Additional notes about this customer..."
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleCreateCustomer} className="w-full btn-primary mt-4">
                Add Customer
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-bizPrimary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{totalCustomers}</div>
              <div className="text-xs text-bizNeutral-500">across all stages</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Active Customers</CardTitle>
              <UserPlus className="h-4 w-4 text-bizSuccess" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{activeCustomers}</div>
              <div className="text-xs text-bizNeutral-500">currently active</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Customer Value</CardTitle>
              <DollarSign className="h-4 w-4 text-bizWarning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">${totalValue.toLocaleString()}</div>
              <div className="text-xs text-bizNeutral-500">total active value</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">New Leads</CardTitle>
              <Star className="h-4 w-4 text-bizAccent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{leads}</div>
              <div className="text-xs text-bizNeutral-500">potential customers</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Database</CardTitle>
            <CardDescription>Search and manage your customer relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-bizNeutral-400" />
                <Input
                  placeholder="Search customers by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="prospect">Prospects</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border border-bizNeutral-200 rounded-lg card-hover">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-bizPrimary/10 rounded-lg">
                      <Users className="h-6 w-6 text-bizPrimary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-bizNeutral-900">{customer.name}</div>
                        <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                        {customer.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-bizNeutral-600 mt-1">
                        {customer.company && (
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {customer.company}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </span>
                        {customer.phone && (
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {customer.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-bizNeutral-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last contact: {customer.lastContact}
                        </span>
                        {customer.value > 0 && (
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Value: ${customer.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={customer.status} 
                      onValueChange={(value: Customer['status']) => handleUpdateStatus(customer.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Customer Details</DialogTitle>
                          <DialogDescription>View and edit customer information</DialogDescription>
                        </DialogHeader>
                        {selectedCustomer && (
                          <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="notes">Notes</TabsTrigger>
                              <TabsTrigger value="history">History</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input value={selectedCustomer.name} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input value={selectedCustomer.email} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phone</Label>
                                  <Input value={selectedCustomer.phone} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Company</Label>
                                  <Input value={selectedCustomer.company} readOnly />
                                </div>
                                <div className="col-span-2 space-y-2">
                                  <Label>Address</Label>
                                  <Input value={selectedCustomer.address} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Input value={selectedCustomer.status} readOnly />
                                </div>
                                <div className="space-y-2">
                                  <Label>Customer Value</Label>
                                  <Input value={`$${selectedCustomer.value.toLocaleString()}`} readOnly />
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="notes" className="space-y-4">
                              <div className="space-y-2">
                                <Label>Customer Notes</Label>
                                <Textarea
                                  value={selectedCustomer.notes}
                                  readOnly
                                  rows={6}
                                  className="resize-none"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2">
                                  {selectedCustomer.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="history" className="space-y-4">
                              <div className="text-center text-bizNeutral-500 py-8">
                                <Calendar className="h-12 w-12 mx-auto mb-4 text-bizNeutral-300" />
                                <p>Interaction history coming soon!</p>
                                <p className="text-sm">Track emails, calls, and meetings with this customer.</p>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-bizNeutral-300" />
                  <p className="text-bizNeutral-500">No customers found matching your criteria.</p>
                  <p className="text-sm text-bizNeutral-400">Try adjusting your search or filter settings.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CRM;
