import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContentGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('general');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt, type: contentType }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate content');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setGeneratedContent(prev => prev + content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }

      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Content Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Content</SelectItem>
              <SelectItem value="business">Business Content</SelectItem>
              <SelectItem value="marketing">Marketing Copy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Prompt</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what content you want to generate..."
            className="min-h-[100px]"
            disabled={isGenerating}
          />
        </div>

        <Button
          onClick={generateContent}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>

        {generatedContent && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Content</label>
            <div className="rounded-lg border bg-muted p-4 min-h-[200px] whitespace-pre-wrap">
              {generatedContent}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                toast({
                  title: "Copied",
                  description: "Content copied to clipboard",
                });
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentGenerator;
