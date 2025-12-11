import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Clock, Mail, Calendar, Bell, Trash2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO, addHours, addDays, isBefore } from 'date-fns';

interface ScheduledEmail {
  id: string;
  appointment_id: string | null;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  scheduled_for: string;
  sent_at: string | null;
  status: string;
  created_at: string;
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  service_name: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
}

const reminderOptions = [
  { value: '1h', label: '1 hour before', hours: 1 },
  { value: '3h', label: '3 hours before', hours: 3 },
  { value: '24h', label: '24 hours before', hours: 24 },
  { value: '48h', label: '2 days before', hours: 48 },
  { value: '168h', label: '1 week before', hours: 168 },
];

const AutomatedEmailScheduler = () => {
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [defaultReminderTime, setDefaultReminderTime] = useState('24h');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    loadData();
    loadSettings();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [emailsResult, appointmentsResult, templatesResult] = await Promise.all([
        supabase
          .from('scheduled_emails')
          .select('*')
          .order('scheduled_for', { ascending: true }),
        supabase
          .from('appointments')
          .select('id, customer_name, customer_email, appointment_date, appointment_time, service_name')
          .gte('appointment_date', new Date().toISOString().split('T')[0])
          .order('appointment_date', { ascending: true }),
        supabase
          .from('email_templates')
          .select('*')
          .eq('template_type', 'appointment_reminder')
      ]);

      setScheduledEmails(emailsResult.data || []);
      setAppointments(appointmentsResult.data || []);
      setTemplates(templatesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = () => {
    const settings = localStorage.getItem('email_scheduler_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setAutoSchedule(parsed.autoSchedule || false);
      setDefaultReminderTime(parsed.defaultReminderTime || '24h');
      setSelectedTemplate(parsed.selectedTemplate || '');
    }
  };

  const saveSettings = (newSettings: { autoSchedule: boolean; defaultReminderTime: string; selectedTemplate: string }) => {
    localStorage.setItem('email_scheduler_settings', JSON.stringify(newSettings));
    setAutoSchedule(newSettings.autoSchedule);
    setDefaultReminderTime(newSettings.defaultReminderTime);
    setSelectedTemplate(newSettings.selectedTemplate);
  };

  const scheduleReminder = async (appointment: Appointment, reminderTime: string = defaultReminderTime) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      const reminderOption = reminderOptions.find(r => r.value === reminderTime);
      if (!reminderOption) return;

      const appointmentDateTime = parseISO(`${appointment.appointment_date}T${appointment.appointment_time}`);
      const scheduledFor = addHours(appointmentDateTime, -reminderOption.hours);

      if (isBefore(scheduledFor, new Date())) {
        toast.error('Cannot schedule reminder in the past');
        return;
      }

      // Get template or use default
      let subject = `Reminder: Your appointment on ${format(appointmentDateTime, 'MMM d, yyyy')}`;
      let body = `Hi ${appointment.customer_name},\n\nThis is a friendly reminder about your upcoming appointment:\n\nDate: ${format(appointmentDateTime, 'EEEE, MMMM d, yyyy')}\nTime: ${appointment.appointment_time}\nService: ${appointment.service_name}\n\nWe look forward to seeing you!\n\nBest regards`;

      if (selectedTemplate) {
        const template = templates.find(t => t.id === selectedTemplate);
        if (template) {
          subject = template.subject
            .replace(/\{\{customer_name\}\}/g, appointment.customer_name)
            .replace(/\{\{appointment_date\}\}/g, format(appointmentDateTime, 'MMM d, yyyy'))
            .replace(/\{\{appointment_time\}\}/g, appointment.appointment_time)
            .replace(/\{\{service_name\}\}/g, appointment.service_name);
          body = template.body
            .replace(/\{\{customer_name\}\}/g, appointment.customer_name)
            .replace(/\{\{appointment_date\}\}/g, format(appointmentDateTime, 'EEEE, MMMM d, yyyy'))
            .replace(/\{\{appointment_time\}\}/g, appointment.appointment_time)
            .replace(/\{\{service_name\}\}/g, appointment.service_name);
        }
      }

      const { error } = await supabase
        .from('scheduled_emails')
        .insert({
          user_id: user.id,
          appointment_id: appointment.id,
          recipient_email: appointment.customer_email,
          recipient_name: appointment.customer_name,
          subject,
          body,
          scheduled_for: scheduledFor.toISOString(),
          status: 'pending'
        });

      if (error) throw error;
      toast.success(`Reminder scheduled for ${format(scheduledFor, 'MMM d, yyyy h:mm a')}`);
      loadData();
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast.error('Failed to schedule reminder');
    }
  };

  const cancelScheduledEmail = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Scheduled email cancelled');
      loadData();
    } catch (error) {
      console.error('Error cancelling email:', error);
      toast.error('Failed to cancel email');
    }
  };

  const sendNow = async (email: ScheduledEmail) => {
    try {
      const response = await supabase.functions.invoke('send-customer-email', {
        body: {
          to: email.recipient_email,
          subject: email.subject,
          body: email.body,
          customerName: email.recipient_name
        }
      });

      if (response.error) throw response.error;

      await supabase
        .from('scheduled_emails')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', email.id);

      toast.success('Email sent successfully!');
      loadData();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const getStatusBadge = (status: string, sentAt: string | null) => {
    if (status === 'sent' && sentAt) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Sent</Badge>;
    }
    if (status === 'failed') {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Automated Email Scheduling
        </CardTitle>
        <CardDescription>Schedule automatic reminder emails for appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Settings */}
        <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Default Settings
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default Reminder Time</Label>
              <Select 
                value={defaultReminderTime} 
                onValueChange={(value) => saveSettings({ autoSchedule, defaultReminderTime: value, selectedTemplate })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reminderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select 
                value={selectedTemplate} 
                onValueChange={(value) => saveSettings({ autoSchedule, defaultReminderTime, selectedTemplate: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default Message</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming Appointments ({appointments.length})
          </h4>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {appointments.slice(0, 10).map((apt) => {
                const hasScheduled = scheduledEmails.some(e => e.appointment_id === apt.id && e.status === 'pending');
                return (
                  <div key={apt.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{apt.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(apt.appointment_date), 'MMM d, yyyy')} at {apt.appointment_time} • {apt.service_name}
                      </p>
                    </div>
                    {hasScheduled ? (
                      <Badge variant="secondary">Scheduled</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => scheduleReminder(apt)}>
                        <Mail className="h-3 w-3 mr-1" />
                        Schedule Reminder
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Scheduled Emails */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Scheduled Emails ({scheduledEmails.length})
          </h4>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : scheduledEmails.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No scheduled emails</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {scheduledEmails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{email.recipient_name}</p>
                      {getStatusBadge(email.status, email.sent_at)}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{email.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {email.status === 'sent' && email.sent_at 
                        ? `Sent: ${format(parseISO(email.sent_at), 'MMM d, h:mm a')}`
                        : `Scheduled: ${format(parseISO(email.scheduled_for), 'MMM d, h:mm a')}`}
                    </p>
                  </div>
                  {email.status === 'pending' && (
                    <div className="flex items-center gap-1 ml-2">
                      <Button size="icon" variant="ghost" onClick={() => sendNow(email)} title="Send now">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => cancelScheduledEmail(email.id)} title="Cancel">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomatedEmailScheduler;
