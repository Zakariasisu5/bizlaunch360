import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  LogIn
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  saveAppointment, 
  loadAppointments, 
  updateAppointmentStatus, 
  deleteAppointment,
  saveService,
  loadServices,
  deleteService,
  AppointmentData,
  ServiceData
} from '@/utils/appointmentStorage';
import { useToast } from '@/hooks/use-toast';

const Appointments = () => {
  const { toast: showToast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  const loadData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const [appointmentsData, servicesData] = await Promise.all([
        loadAppointments(),
        loadServices()
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error instanceof Error && !error.message.includes('authenticated')) {
        showToast({
          title: "Error",
          description: "Failed to load appointment data",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  const [isSaving, setIsSaving] = useState(false);

  const handleCreateAppointment = async () => {
    if (!isAuthenticated) {
      showToast({
        title: "Authentication Required",
        description: "Please sign in to create appointments",
        variant: "destructive"
      });
      return;
    }

    if (!newAppointment.customer || !newAppointment.email || !newAppointment.date || !newAppointment.time || !newAppointment.service) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedService = services.find(s => s.name === newAppointment.service);
    if (!selectedService) {
      toast.error('Please select a valid service');
      return;
    }

    setIsSaving(true);
    try {
      const appointmentData: AppointmentData = {
        title: selectedService.name,
        customerName: newAppointment.customer,
        customerEmail: newAppointment.email,
        customerPhone: newAppointment.phone,
        appointmentDate: newAppointment.date,
        appointmentTime: newAppointment.time,
        duration: selectedService.duration,
        status: 'confirmed',
        serviceName: selectedService.name,
        notes: newAppointment.notes
      };

      await saveAppointment(appointmentData);
      await loadData();
      
      setNewAppointment({
        customer: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      });
      
      showToast({
        title: "Success",
        description: "Appointment created successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      showToast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateService = async () => {
    if (!isAuthenticated) {
      showToast({
        title: "Authentication Required",
        description: "Please sign in to create services",
        variant: "destructive"
      });
      return;
    }

    if (!newService.name || !newService.duration || !newService.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const serviceData: ServiceData = {
        name: newService.name,
        duration: parseInt(newService.duration),
        price: parseFloat(newService.price),
        description: newService.description
      };

      await saveService(serviceData);
      await loadData();
      
      setNewService({ name: '', duration: '', price: '', description: '' });
      
      showToast({
        title: "Success",
        description: "Service created successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error creating service:', error);
      showToast({
        title: "Error",
        description: "Failed to create service",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed') => {
    if (!isAuthenticated) return;
    
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      await loadData();
      toast.success(`Appointment status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      showToast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive"
      });
    }
  };

  const todayAppointments = appointments.filter(apt => apt.appointmentDate === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = appointments.filter(apt => new Date(apt.appointmentDate) > new Date());

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to manage your appointments</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                <Button disabled={!isAuthenticated}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
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
                    <Label htmlFor="customer-email">Email *</Label>
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
                <Button onClick={handleCreateAppointment} disabled={isSaving} className="w-full">
                  {isSaving ? 'Creating...' : 'Create Appointment'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayAppointments.filter(apt => apt.status === 'confirmed').length} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">appointments scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">available services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.length > 0 
                  ? Math.round((appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">appointment completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
            <CardDescription>Manage your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments yet</p>
              ) : (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <Badge variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'pending' ? 'secondary' :
                          appointment.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{appointment.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{appointment.customerEmail}</span>
                        </div>
                        {appointment.customerPhone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{appointment.customerPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.appointmentDate} at {appointment.appointmentTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.duration} minutes</span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Select 
                        value={appointment.status} 
                        onValueChange={(value) => handleStatusChange(appointment.id!, value as any)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Appointments;