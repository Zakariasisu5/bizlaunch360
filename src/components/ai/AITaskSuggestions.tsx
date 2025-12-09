import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Loader2, Sparkles, RefreshCw, Users, DollarSign, Megaphone, Settings, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Task {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'customers' | 'finance' | 'marketing' | 'operations' | 'appointments';
}

interface AITaskSuggestionsProps {
  businessData?: {
    pendingInvoices?: number;
    overdueInvoices?: number;
    newLeads?: number;
    upcomingAppointments?: number;
    inactiveCustomers?: number;
    outstandingExpenses?: number;
  };
}

export const AITaskSuggestions: React.FC<AITaskSuggestionsProps> = ({ businessData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'customers': return <Users className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      case 'marketing': return <Megaphone className="h-4 w-4" />;
      case 'operations': return <Settings className="h-4 w-4" />;
      case 'appointments': return <Calendar className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-amber-500 text-white';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const generateTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-task-suggestions', {
        body: { businessData }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setTasks(data.tasks || []);
      setCompletedTasks(new Set());
      toast.success('Task suggestions updated!');
    } catch (error: any) {
      console.error('Error generating tasks:', error);
      toast.error(error.message || 'Failed to generate tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskComplete = (index: number) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedTasks(newCompleted);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">AI Task Suggestions</CardTitle>
          </div>
          <Button 
            onClick={generateTasks} 
            disabled={isLoading}
            size="sm"
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <CardDescription>
          Smart tasks based on your business data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 && !isLoading && (
          <div className="text-center py-6">
            <CheckSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">No suggestions yet</p>
            <Button onClick={generateTasks} size="sm" className="bg-primary hover:bg-primary/90">
              Get Suggestions
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-6">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">Analyzing your business...</p>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  completedTasks.has(index) 
                    ? 'bg-muted/50 border-muted opacity-60' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
                onClick={() => toggleTaskComplete(index)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${completedTasks.has(index) ? 'bg-muted' : 'bg-primary/10'}`}>
                    {getCategoryIcon(task.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm ${completedTasks.has(index) ? 'line-through' : ''}`}>
                        {task.title}
                      </span>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
