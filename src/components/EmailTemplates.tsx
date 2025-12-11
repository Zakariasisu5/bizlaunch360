import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Plus, Trash2, Edit, Copy, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  created_at: string;
}

const templateTypes = [
  { value: 'appointment_reminder', label: 'Appointment Reminder' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'confirmation', label: 'Confirmation' },
  { value: 'thank_you', label: 'Thank You' },
  { value: 'general', label: 'General' },
];

const defaultTemplates = [
  {
    name: 'Appointment Reminder',
    subject: 'Reminder: Your appointment is coming up',
    body: 'Hi {{customer_name}},\n\nThis is a friendly reminder that you have an appointment scheduled for {{appointment_date}} at {{appointment_time}}.\n\nService: {{service_name}}\n\nIf you need to reschedule, please contact us.\n\nBest regards,\n{{business_name}}',
    template_type: 'appointment_reminder'
  },
  {
    name: 'Follow Up Message',
    subject: 'Following up on your recent visit',
    body: 'Hi {{customer_name}},\n\nThank you for choosing {{business_name}}! We hope you had a great experience.\n\nWe\'d love to hear your feedback. Feel free to reply to this email with any comments.\n\nSee you again soon!\n\nBest regards,\n{{business_name}}',
    template_type: 'follow_up'
  },
  {
    name: 'Booking Confirmation',
    subject: 'Your appointment is confirmed',
    body: 'Hi {{customer_name}},\n\nYour appointment has been confirmed!\n\nDetails:\n- Date: {{appointment_date}}\n- Time: {{appointment_time}}\n- Service: {{service_name}}\n\nWe look forward to seeing you!\n\nBest regards,\n{{business_name}}',
    template_type: 'confirmation'
  }
];

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    template_type: 'general'
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save templates');
        return;
      }

      if (!formData.name || !formData.subject || !formData.body) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (editingTemplate) {
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: formData.name,
            subject: formData.subject,
            body: formData.body,
            template_type: formData.template_type
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('Template updated successfully!');
      } else {
        const { error } = await supabase
          .from('email_templates')
          .insert({
            user_id: user.id,
            name: formData.name,
            subject: formData.subject,
            body: formData.body,
            template_type: formData.template_type
          });

        if (error) throw error;
        toast.success('Template created successfully!');
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      setFormData({ name: '', subject: '', body: '', template_type: 'general' });
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Template deleted');
      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      template_type: template.template_type
    });
    setIsDialogOpen(true);
  };

  const handleUseDefault = async (template: typeof defaultTemplates[0]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      const { error } = await supabase
        .from('email_templates')
        .insert({
          user_id: user.id,
          ...template
        });

      if (error) throw error;
      toast.success('Default template added!');
      loadTemplates();
    } catch (error) {
      console.error('Error adding default template:', error);
      toast.error('Failed to add template');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Templates
            </CardTitle>
            <CardDescription>Create and manage reusable email templates</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTemplate(null);
              setFormData({ name: '', subject: '', body: '', template_type: 'general' });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                <DialogDescription>
                  Use variables like {'{{customer_name}}'}, {'{{appointment_date}}'}, {'{{business_name}}'} for personalization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name *</Label>
                    <Input
                      placeholder="e.g., Welcome Email"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject Line *</Label>
                  <Input
                    placeholder="Email subject..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body *</Label>
                  <Textarea
                    placeholder="Write your email content..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={10}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingTemplate ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Templates */}
        {templates.length === 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Start Templates</h4>
            <div className="grid gap-3">
              {defaultTemplates.map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground">{template.subject}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleUseDefault(template)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Templates */}
        {templates.length > 0 && (
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{template.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {templateTypes.find(t => t.value === template.template_type)?.label || template.template_type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{template.body}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(template.body)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading templates...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailTemplates;
