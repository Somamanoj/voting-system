import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ElectionSection from '../components/ElectionSection';
import VotingFAQSection from '../components/FAQSection';
import FooterSection from '../components/FooterSection';

const BackgroundGradient = () => {
  return (
    <>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0">
          {/* Hero section left  */}
          <div className="absolute top-20 -left-0 md:left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
          {/* Hero section right  */}
          <div className="absolute top-80 -right-20 md:right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        </div>
        {/* Elections section  */}
        <div className="absolute top-[100vh] left-1 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-3000" />
        {/* Voting Process section  */}
        <div className="absolute top-[190vh] right-32 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        {/* Testimonials section  */}
        <div className="absolute top-[260vh] left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-5000" />
        {/* FAQs section  */}
        <div className="absolute top-[400vh] left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-7000" />
        {/* Contact section  */}
        <div className="absolute top-[550vh] left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-7000" />
        {/* Footer section  */}
        <div className="absolute bottom-[-20vh] left-16 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-8000" />
      </div>
    </>
  );
};

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen pt-20 overflow-hidden">
      <BackgroundGradient />
      <HeroSection />
      <ElectionSection />
      <VotingFAQSection />
      <FooterSection />

    </main>
  );
};

export default LandingPage;