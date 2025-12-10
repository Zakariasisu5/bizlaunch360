import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageSquare, Loader2, Sparkles, Copy, Check, Send, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomerInfo {
  name: string;
  email?: string;
}

interface BusinessInfo {
  name?: string;
  type?: string;
  email?: string;
}

interface AICustomerMessagingProps {
  customer?: CustomerInfo;
  businessInfo?: BusinessInfo;
  onMessageGenerated?: (message: string) => void;
}

export const AICustomerMessaging: React.FC<AICustomerMessagingProps> = ({ 
  customer, 
  businessInfo,
  onMessageGenerated 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageType, setMessageType] = useState('follow-up');
  const [context, setContext] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState(customer?.email || '');

  const messageTypes = [
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'confirmation', label: 'Confirmation' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'reply', label: 'Reply' },
  ];

  const getSubjectFromType = (type: string, customerName: string): string => {
    const subjects: Record<string, string> = {
      'follow-up': `Following up - ${businessInfo?.name || 'Our Team'}`,
      'reminder': `Friendly Reminder from ${businessInfo?.name || 'Us'}`,
      'confirmation': `Confirmation - ${businessInfo?.name || 'Our Team'}`,
      'thank-you': `Thank You, ${customerName}!`,
      'promotion': `Special Offer from ${businessInfo?.name || 'Us'}`,
      'reply': `Re: Your Message - ${businessInfo?.name || 'Our Team'}`,
    };
    return subjects[type] || `Message from ${businessInfo?.name || 'Our Team'}`;
  };

  const generateMessage = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-customer-messaging', {
        body: { 
          messageType, 
          customerInfo: customer,
          businessInfo,
          context 
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setGeneratedMessage(data.message);
      onMessageGenerated?.(data.message);
      toast.success('Message generated!');
    } catch (error: any) {
      console.error('Error generating message:', error);
      toast.error(error.message || 'Failed to generate message');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = async () => {
    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    if (!generatedMessage) {
      toast.error('Please generate a message first');
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-customer-email', {
        body: {
          to: recipientEmail,
          subject: getSubjectFromType(messageType, customer?.name || 'Customer'),
          message: generatedMessage,
          businessName: businessInfo?.name,
          businessEmail: businessInfo?.email
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Email sent to ${recipientEmail}!`);
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Customer Messaging</CardTitle>
        </div>
        <CardDescription>
          Generate and send personalized messages for {customer?.name || 'your customers'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Message Type</Label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {messageTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Additional Context (optional)</Label>
            <Textarea
              placeholder="e.g., They purchased last week..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <Button 
          onClick={generateMessage} 
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Generate Message
            </>
          )}
        </Button>

        {generatedMessage && (
          <div className="space-y-4">
            <div className="relative">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm whitespace-pre-wrap pr-10">{generatedMessage}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Email Sending Section */}
            <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Mail className="h-4 w-4" />
                Send via Email
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Recipient email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={sendEmail}
                  disabled={isSending || !recipientEmail}
                  className="sm:w-auto"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
