import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomerInfo {
  name: string;
  email?: string;
}

interface BusinessInfo {
  name?: string;
  type?: string;
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
  const [messageType, setMessageType] = useState('follow-up');
  const [context, setContext] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const messageTypes = [
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'reminder', label: 'Reminder' },
    { value: 'confirmation', label: 'Confirmation' },
    { value: 'thank-you', label: 'Thank You' },
    { value: 'promotion', label: 'Promotion' },
    { value: 'reply', label: 'Reply' },
  ];

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

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Customer Messaging</CardTitle>
        </div>
        <CardDescription>
          Generate personalized messages for {customer?.name || 'your customers'}
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
          <div className="relative">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{generatedMessage}</p>
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
        )}
      </CardContent>
    </Card>
  );
};
