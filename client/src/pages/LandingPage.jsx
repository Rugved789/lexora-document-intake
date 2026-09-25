import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import ConversationToStructure from '../components/ConversationToStructure';
import ContradictionDemo from '../components/ContradictionDemo';
import PremiumDocumentPreview from '../components/PremiumDocumentPreview';
import ProcessTimeline from '../components/ProcessTimeline';
import FinalCTA from '../components/FinalCTA';
import PremiumFooter from '../components/PremiumFooter';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Premium Navigation */}
      <Navigation />

      {/* Hero Section with 3D Document Scene */}
      <Hero />

      {/* Conversation → Structure Section */}
      <ConversationToStructure />

      {/* Contradiction Detection Demo */}
      <ContradictionDemo />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Document Preview */}
      <PremiumDocumentPreview />

      {/* Final CTA */}
      <FinalCTA />

      {/* Premium Footer */}
      <PremiumFooter />
    </div>
  );
}

export default LandingPage;
