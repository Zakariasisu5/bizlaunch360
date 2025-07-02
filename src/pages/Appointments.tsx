
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
import { 
  Calendar, 
  Clock, 
  Plus, 
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Settings,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  title: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  service: string;
  notes?: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Consultation Call',
      customer: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      date: '2024-01-25',
      time: '10:00',
      duration: 60,
      status: 'confirmed',
      service: 'Business Consultation',
      notes: 'Initial consultation for new project'
    },
    {
      id: '2',
      title: 'Strategy Session',
      customer: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '+1 (555) 987-6543',
      date: '2024-01-25',
      time: '14:30',
      duration: 90,
      status: 'pending',
      service: 'Strategy Planning',
      notes: 'Review quarterly goals and planning'
    },
    {
      id: '3',
      title: 'Follow-up Meeting',
      customer: 'Mike Davis',
      email: 'mike@startup.com',
      phone: '+1 (555) 456-7890',
      date: '2024-01-26',
      time: '09:00',
      duration: 45,
      status: 'confirmed',
      service: 'Follow-up Session'
    }
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Business Consultation',
      duration: 60,
      price: 150,
      description: 'Initial consultation to understand your business needs'
    },
    {
      id: '2',
      name: 'Strategy Planning',
      duration: 90,
      price: 200,
      description: 'Comprehensive strategy planning session'
    },
    {
      id: '3',
      name: 'Follow-up Session',
      duration: 45,
      price: 100,
      description: 'Follow-up meeting to track progress'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    customer: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  });

  const [newService, setNewService] = useState({
    name: '',
    duration: '',
    price: '',
    description: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-bizSuccess text-white';
      case 'pending': return 'bg-bizWarning text-white';
      case 'cancelled': return 'bg-bizError text-white';
      case 'completed': return 'bg-bizNeutral-500 text-white';
      default: return 'bg-bizNeutral-200 text-bizNeutral-800';
    }
  };

  const handleCreateAppointment = () => {
    if (!newAppointment.customer || !newAppointment.date || !newAppointment.time || !newAppointment.service) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedService = services.find(s => s.name === newAppointment.service);
    if (!selectedService) {
      toast.error('Please select a valid service');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: selectedService.name,
      customer: newAppointment.customer,
      email: newAppointment.email,
      phone: newAppointment.phone,
      date: newAppointment.date,
      time: newAppointment.time,
      duration: selectedService.duration,
      status: 'confirmed',
      service: selectedService.name,
      notes: newAppointment.notes
    };

    setAppointments([appointment, ...appointments]);
    setNewAppointment({
      customer: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service: '',
      notes: ''
    });
    toast.success('Appointment created successfully!');
  };

  const handleCreateService = () => {
    if (!newService.name || !newService.duration || !newService.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      duration: parseInt(newService.duration),
      price: parseFloat(newService.price),
      description: newService.description
    };

    setServices([...services, service]);
    setNewService({ name: '', duration: '', price: '', description: '' });
    toast.success('Service created successfully!');
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed') => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
    toast.success(`Appointment status updated to ${newStatus}!`);
  };

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) > new Date());

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bizNeutral-900">Appointment Management</h1>
            <p className="text-bizNeutral-600 mt-2">Manage your schedule and client appointments</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Services
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Services</DialogTitle>
                  <DialogDescription>Add or edit your available services</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Add New Service</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service-name">Service Name</Label>
                        <Input
                          id="service-name"
                          placeholder="Enter service name"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service-duration">Duration (minutes)</Label>
                        <Input
                          id="service-duration"
                          type="number"
                          placeholder="60"
                          value={newService.duration}
                          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-price">Price ($)</Label>
                      <Input
                        id="service-price"
                        type="number"
                        placeholder="0.00"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-description">Description</Label>
                      <Textarea
                        id="service-description"
                        placeholder="Describe this service..."
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleCreateService} className="w-full btn-primary">
                      Add Service
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Current Services</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border border-bizNeutral-200 rounded-lg">
                          <div>
                            <div className="font-medium text-bizNeutral-900">{service.name}</div>
                            <div className="text-sm text-bizNeutral-600">{service.duration}min • ${service.price}</div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Book New Appointment</DialogTitle>
                  <DialogDescription>Schedule a new appointment with a client</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter customer name"
                      value={newAppointment.customer}
                      onChange={(e) => setNewAppointment({ ...newAppointment, customer: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={newAppointment.email}
                      onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone</Label>
                    <Input
                      id="customer-phone"
                      placeholder="+1 (555) 123-4567"
                      value={newAppointment.phone}
                      onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-select">Service *</Label>
                    <Select value={newAppointment.service} onValueChange={(value) => setNewAppointment({ ...newAppointment, service: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.name}>
                            {service.name} ({service.duration}min - ${service.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointment-date">Date *</Label>
                    <Input
                      id="appointment-date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointment-time">Time *</Label>
                    <Input
                      id="appointment-time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="appointment-notes">Notes</Label>
                    <Textarea
                      id="appointment-notes"
                      placeholder="Additional notes or details..."
                      value={newAppointment.notes}
                      onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateAppointment} className="w-full btn-primary mt-4">
                  Book Appointment
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-bizPrimary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{todayAppointments.length}</div>
              <div className="text-xs text-bizNeutral-500">
                {todayAppointments.filter(apt => apt.status === 'confirmed').length} confirmed
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">This Week</CardTitle>
              <Clock className="h-4 w-4 text-bizAccent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{upcomingAppointments.length}</div>
              <div className="text-xs text-bizNeutral-500">upcoming appointments</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Total Services</CardTitle>
              <Settings className="h-4 w-4 text-bizSuccess" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">{services.length}</div>
              <div className="text-xs text-bizNeutral-500">available services</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bizNeutral-600">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-bizWarning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bizNeutral-900">94%</div>
              <div className="text-xs text-bizNeutral-500">appointment completion</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-bizNeutral-200 rounded-lg card-hover">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-bizPrimary/10 rounded-lg">
                          <User className="h-6 w-6 text-bizPrimary" />
                        </div>
                        <div>
                          <div className="font-medium text-bizNeutral-900">{appointment.customer}</div>
                          <div className="text-sm text-bizNeutral-600">{appointment.service}</div>
                          <div className="flex items-center space-x-4 text-xs text-bizNeutral-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time} ({appointment.duration}min)
                            </span>
                          </div>
                          {appointment.email && (
                            <div className="flex items-center text-xs text-bizNeutral-500 mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {appointment.email}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        <div className="flex items-center space-x-2">
                          {appointment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="btn-success"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm
                            </Button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'completed')}
                              variant="outline"
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Link</CardTitle>
                <CardDescription>Share this link for online bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-bizNeutral-50 rounded-lg">
                    <div className="text-sm text-bizNeutral-600 mb-2">Your booking URL:</div>
                    <div className="text-sm font-mono text-bizPrimary break-all">
                      https://bizlaunch360.com/book/your-business
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Your current service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div key={service.id} className="p-3 border border-bizNeutral-200 rounded-lg">
                      <div className="font-medium text-bizNeutral-900">{service.name}</div>
                      <div className="text-sm text-bizNeutral-600">{service.duration} minutes • ${service.price}</div>
                      {service.description && (
                        <div className="text-xs text-bizNeutral-500 mt-1">{service.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your appointment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-bizNeutral-600">Total Booked</span>
                    <span className="font-medium">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bizNeutral-600">Completed</span>
                    <span className="font-medium text-bizSuccess">
                      {appointments.filter(apt => apt.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bizNeutral-600">Cancelled</span>
                    <span className="font-medium text-bizError">
                      {appointments.filter(apt => apt.status === 'cancelled').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-bizNeutral-600">Revenue</span>
                    <span className="font-medium text-bizSuccess">
                      ${appointments
                        .filter(apt => apt.status === 'completed')
                        .reduce((sum, apt) => {
                          const service = services.find(s => s.name === apt.service);
                          return sum + (service?.price || 0);
                        }, 0)
                        .toLocaleString()
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
