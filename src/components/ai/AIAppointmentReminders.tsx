import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bell, Loader2, Sparkles, Copy, Check, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Appointment {
  customerName: string;
  customerEmail?: string;
  serviceName: string;
  date: string;
  time: string;
  duration?: number;
  notes?: string;
}

interface AIAppointmentRemindersProps {
  appointment: Appointment;
  businessInfo?: {
    name?: string;
  };
  onReminderGenerated?: (reminder: string) => void;
}

export const AIAppointmentReminders: React.FC<AIAppointmentRemindersProps> = ({ 
  appointment, 
  businessInfo,
  onReminderGenerated 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reminderType, setReminderType] = useState('24h');
  const [generatedReminder, setGeneratedReminder] = useState('');
  const [copied, setCopied] = useState(false);

  const reminderTypes = [
    { value: 'confirmation', label: 'Booking Confirmation' },
    { value: '1week', label: '1 Week Before' },
    { value: '24h', label: '24 Hours Before' },
    { value: '1h', label: '1 Hour Before' },
  ];

  const generateReminder = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-appointment-reminders', {
        body: { 
          appointment, 
          businessInfo,
          reminderType 
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setGeneratedReminder(data.reminder);
      onReminderGenerated?.(data.reminder);
      toast.success('Reminder generated!');
    } catch (error: any) {
      console.error('Error generating reminder:', error);
      toast.error(error.message || 'Failed to generate reminder');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedReminder);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Reminder</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Generate a reminder for {appointment.customerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs">Reminder Type</Label>
          <Select value={reminderType} onValueChange={setReminderType}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reminderTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateReminder} 
          disabled={isLoading}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Bell className="h-3 w-3 mr-2" />
              Generate Reminder
            </>
          )}
        </Button>

        {generatedReminder && (
          <div className="relative">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs whitespace-pre-wrap pr-8">{generatedReminder}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
