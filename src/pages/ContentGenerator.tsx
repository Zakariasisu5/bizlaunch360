import React from 'react';
import Layout from '@/components/Layout';
import ContentGenerator from '@/components/ContentGenerator';

const ContentGeneratorPage = () => {
  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI Content Generator</h1>
          <p className="text-muted-foreground">Generate high-quality content for your business using AI</p>
        </div>
        <ContentGenerator />
      </div>
    </Layout>
  );
};

export default ContentGeneratorPage;
