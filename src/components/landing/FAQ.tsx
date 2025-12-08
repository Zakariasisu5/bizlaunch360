import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "Is there a free trial?",
    answer: "Absolutely! You get a 14-day free trial with full access to all features. No credit card required to start — just sign up and explore."
  },
  {
    question: "What's included in the free plan?",
    answer: "The free plan gives you access to basic business planning tools, up to 50 customers in your CRM, and 5 appointments per month. Perfect for testing the waters."
  },
  {
    question: "How much does it cost after the trial?",
    answer: "Our paid plans start at $19/month for solo entrepreneurs and scale up based on your team size and feature needs. We keep pricing simple — no hidden fees or surprises."
  },
  {
    question: "Can I create a business plan with this?",
    answer: "Yes! We have AI-powered business plan generation with industry-specific templates. Whether you're opening a restaurant or launching a tech startup, we've got you covered."
  },
  {
    question: "How do I get started?",
    answer: "Just click 'Try it free' and create your account. The onboarding takes about 2 minutes — we'll ask a few questions about your business and set everything up for you."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Of course. No contracts, no cancellation fees. If it's not working for you, you can cancel with one click. We'll even let you export all your data."
  }
];

const FAQ = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Got questions? We've got answers.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Here's what people usually ask us before getting started.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-5 sm:px-6 data-[state=open]:shadow-lg transition-shadow duration-300"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-medium text-card-foreground hover:text-primary py-4 sm:py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm sm:text-base pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
