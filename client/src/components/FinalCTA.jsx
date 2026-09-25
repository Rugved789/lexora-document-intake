import React, { useState } from 'react';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function FinalCTA() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = () => {
    setIsNavigating(true);
    navigate('/app');
  };

  return (
    <section className="py-28 md:py-36 bg-[#0F1419] relative overflow-hidden text-white">
      {/* Editorial ambient radial glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-medium text-amber-300 tracking-wider uppercase backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Commence Intake • Instant Preview
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
            Start organizing your wishes today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Join hundreds who have transformed fragmented thoughts into structured, attorney-ready documents without legal jargon.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          {isSignedIn ? (
            <button 
              onClick={handleNavigation}
              disabled={isNavigating}
              className="group px-8 py-4 bg-[#FDFCFA] text-[#0F1419] rounded-xl text-base font-semibold hover:bg-white transition-all duration-300 shadow-[0_10px_35px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.22)] transform hover:-translate-y-0.5 flex items-center gap-3 disabled:opacity-50 disabled:cursor-wait"
            >
              {isNavigating ? (
                <>
                  <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                  <span>Preparing Session...</span>
                </>
              ) : (
                <>
                  <span>Create Your Document</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="group px-8 py-4 bg-[#FDFCFA] text-[#0F1419] rounded-xl text-base font-semibold hover:bg-white transition-all duration-300 shadow-[0_10px_35px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_45px_rgba(255,255,255,0.22)] transform hover:-translate-y-0.5 flex items-center gap-3">
                <span>Create Your Document</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </SignInButton>
          )}

          <button
            onClick={() => {
              const element = document.getElementById('how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 border border-white/20 text-white rounded-xl text-base font-medium hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300"
          >
            Learn How It Works
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm font-sans text-stone-300">
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full shadow-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
            <span>Confidential & Encrypted</span>
          </div>
          
          <div className="flex items-center gap-2 backdrop-blur-md bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full shadow-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span>You Own Your Data</span>
          </div>

          <div className="flex items-center gap-2 backdrop-blur-md bg-white/[0.04] border border-white/10 px-4 py-2 rounded-full shadow-sm">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span>Instant PDF Export</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
