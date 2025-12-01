import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  review: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Founder',
    company: 'Creative Studio NYC',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'BizLaunch360 transformed how I run my design studio. The AI business plan generator saved me weeks of work, and the invoicing system has helped me get paid 40% faster!'
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'CEO',
    company: 'TechFlow Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'As a first-time entrepreneur, this platform was a game-changer. The CRM and appointment booking features alone have increased my client retention by 60%.'
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Owner',
    company: 'Wellness Hub',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'I went from struggling with spreadsheets to having a complete business overview. The analytics dashboard helps me make smarter decisions every day.'
  },
  {
    id: 4,
    name: 'David Rodriguez',
    role: 'Consultant',
    company: 'Growth Advisors',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'I recommend BizLaunch360 to all my clients. It\'s the most comprehensive yet easy-to-use business platform I\'ve seen in 15 years of consulting.'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Director',
    company: 'Event Masters',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'The appointment scheduling feature alone is worth it. My booking rate increased by 200% since I started using BizLaunch360. Absolutely essential!'
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Founder',
    company: 'Digital Marketing Pro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    review: 'From business planning to client management, everything is seamless. The AI features feel like having a business advisor on call 24/7.'
  }
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
        />
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Customer Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by Entrepreneurs Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about how BizLaunch360 has transformed their businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Rating */}
              <StarRating rating={testimonial.rating} />
              
              {/* Review text */}
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
                "{testimonial.review}"
              </p>
              
              {/* Author info */}
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-card rounded-full px-8 py-4 shadow-lg border border-border">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground">4.9 out of 5</p>
              <p className="text-sm text-muted-foreground">Based on 1,200+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
