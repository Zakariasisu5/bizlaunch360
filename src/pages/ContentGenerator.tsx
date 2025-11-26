import React from 'react';
import Layout from '@/components/Layout';
import ContentGenerator from '@/components/ContentGenerator';

const ContentGeneratorPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-bizNeutral-900">AI Content Generator</h1>
          <p className="text-bizNeutral-600">Generate high-quality content for your business using AI</p>
        </div>
        <ContentGenerator />
      </div>
    </Layout>
  );
};

export default ContentGeneratorPage;
