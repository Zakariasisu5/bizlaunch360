import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Plus, Trash2, Edit, Quote, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  customer_avatar_url: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_company: '',
    content: '',
    rating: 5,
    is_featured: false
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save testimonials');
        return;
      }

      if (!formData.customer_name || !formData.content) {
        toast.error('Please fill in customer name and testimonial content');
        return;
      }

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            customer_name: formData.customer_name,
            customer_company: formData.customer_company || null,
            content: formData.content,
            rating: formData.rating,
            is_featured: formData.is_featured
          })
          .eq('id', editingTestimonial.id);

        if (error) throw error;
        toast.success('Testimonial updated!');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            user_id: user.id,
            customer_name: formData.customer_name,
            customer_company: formData.customer_company || null,
            content: formData.content,
            rating: formData.rating,
            is_featured: formData.is_featured
          });

        if (error) throw error;
        toast.success('Testimonial added!');
      }

      setIsDialogOpen(false);
      setEditingTestimonial(null);
      setFormData({ customer_name: '', customer_company: '', content: '', rating: 5, is_featured: false });
      loadTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Testimonial deleted');
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_company: testimonial.customer_company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      is_featured: testimonial.is_featured
    });
    setIsDialogOpen(true);
  };

  const toggleFeatured = async (testimonial: Testimonial) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_featured: !testimonial.is_featured })
        .eq('id', testimonial.id);

      if (error) throw error;
      toast.success(testimonial.is_featured ? 'Removed from featured' : 'Added to featured');
      loadTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              Customer Testimonials
            </CardTitle>
            <CardDescription>Collect and manage customer reviews and testimonials</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTestimonial(null);
              setFormData({ customer_name: '', customer_company: '', content: '', rating: 5, is_featured: false });
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                <DialogDescription>Add a customer testimonial to showcase on your business</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    placeholder="John Smith"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company (Optional)</Label>
                  <Input
                    placeholder="Acme Corp"
                    value={formData.customer_company}
                    onChange={(e) => setFormData({ ...formData, customer_company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Testimonial *</Label>
                  <Textarea
                    placeholder="What did the customer say about your service?"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
                    <span className="text-sm text-muted-foreground">({formData.rating}/5)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">Feature this testimonial</Label>
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <Quote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium">No testimonials yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first customer testimonial to showcase your business</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className={`p-4 border rounded-lg ${testimonial.is_featured ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium">{testimonial.customer_name}</h4>
                        {testimonial.customer_company && (
                          <span className="text-sm text-muted-foreground">• {testimonial.customer_company}</span>
                        )}
                        {testimonial.is_featured && (
                          <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">Featured</span>
                        )}
                      </div>
                      {renderStars(testimonial.rating)}
                      <p className="text-sm text-muted-foreground mt-2 italic">"{testimonial.content}"</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleFeatured(testimonial)} title={testimonial.is_featured ? 'Remove from featured' : 'Add to featured'}>
                      <Star className={`h-4 w-4 ${testimonial.is_featured ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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

export default TestimonialsManager;
