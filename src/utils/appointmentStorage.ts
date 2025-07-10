import { supabase } from '@/integrations/supabase/client';

export interface AppointmentData {
  id?: string;
  title: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  serviceName: string;
  notes?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceData {
  id?: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const saveAppointment = async (appointmentData: AppointmentData): Promise<AppointmentData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save appointments');
  }

  const appointmentPayload = {
    user_id: user.id,
    title: appointmentData.title,
    customer_name: appointmentData.customerName,
    customer_email: appointmentData.customerEmail,
    customer_phone: appointmentData.customerPhone,
    appointment_date: appointmentData.appointmentDate,
    appointment_time: appointmentData.appointmentTime,
    duration: appointmentData.duration,
    status: appointmentData.status,
    service_name: appointmentData.serviceName,
    notes: appointmentData.notes,
  };

  let result;

  if (appointmentData.id) {
    // Update existing appointment
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentPayload)
      .eq('id', appointmentData.id)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    // Create new appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentPayload)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  }

  return {
    id: result.id,
    title: result.title,
    customerName: result.customer_name,
    customerEmail: result.customer_email,
    customerPhone: result.customer_phone,
    appointmentDate: result.appointment_date,
    appointmentTime: result.appointment_time,
    duration: result.duration,
    status: result.status,
    serviceName: result.service_name,
    notes: result.notes,
    userId: result.user_id,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
};

export const loadAppointments = async (): Promise<AppointmentData[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to load appointments');
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('appointment_date', { ascending: true });

  if (error) throw error;

  return data.map(appointment => ({
    id: appointment.id,
    title: appointment.title,
    customerName: appointment.customer_name,
    customerEmail: appointment.customer_email,
    customerPhone: appointment.customer_phone,
    appointmentDate: appointment.appointment_date,
    appointmentTime: appointment.appointment_time,
    duration: appointment.duration,
    status: appointment.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
    serviceName: appointment.service_name,
    notes: appointment.notes,
    userId: appointment.user_id,
    createdAt: appointment.created_at,
    updatedAt: appointment.updated_at,
  }));
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId);

  if (error) throw error;
};

export const updateAppointmentStatus = async (appointmentId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) throw error;
};

export const saveService = async (serviceData: ServiceData): Promise<ServiceData> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save services');
  }

  const servicePayload = {
    user_id: user.id,
    name: serviceData.name,
    description: serviceData.description,
    duration: serviceData.duration,
    price: serviceData.price,
  };

  let result;

  if (serviceData.id) {
    // Update existing service
    const { data, error } = await supabase
      .from('services')
      .update(servicePayload)
      .eq('id', serviceData.id)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  } else {
    // Create new service
    const { data, error } = await supabase
      .from('services')
      .insert(servicePayload)
      .select()
      .single();
    
    if (error) throw error;
    result = data;
  }

  return {
    id: result.id,
    name: result.name,
    description: result.description,
    duration: result.duration,
    price: result.price,
    userId: result.user_id,
    createdAt: result.created_at,
    updatedAt: result.updated_at,
  };
};

export const loadServices = async (): Promise<ServiceData[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to load services');
  }

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) throw error;

  return data.map(service => ({
    id: service.id,
    name: service.name,
    description: service.description,
    duration: service.duration,
    price: service.price,
    userId: service.user_id,
    createdAt: service.created_at,
    updatedAt: service.updated_at,
  }));
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId);

  if (error) throw error;
};