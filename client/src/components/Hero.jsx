import React, { useState } from 'react';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Hero() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = () => {
    setIsNavigating(true);
    navigate('/app');
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-background-subtle pt-24 pb-16 lg:pt-28 lg:pb-24">
      {/* Animated Subtle Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-12 w-96 h-96 bg-accent/[0.03] rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-16 right-12 w-[28rem] h-[28rem] bg-document/[0.04] rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.015] rounded-full blur-3xl"></div>
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0F1419 1px, transparent 0)', 
            backgroundSize: '32px 32px' 
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left: Content (7 cols) */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-8 z-10">
            <div className="space-y-5">
              {/* Category pill */}
              <div className="inline-block">
                <span className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-primary/[0.03] border border-primary/[0.08] rounded-full text-xs font-semibold text-primary/80 tracking-wide uppercase shadow-2xs backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  A New Way to Organize
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight font-serif leading-[1.08]">
                YOUR WISHES
              </h1>
              
              <p className="text-xl sm:text-2xl text-secondary leading-relaxed font-serif font-light max-w-xl mx-auto lg:mx-0">
                Turn a natural conversation into a structured personal wishes document.
              </p>
              
              <p className="text-base text-secondary-light leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                No complicated forms. No legal jargon. Just a guided, intuitive conversation that securely extracts and organizes confirmed data in real time.
              </p>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              {isSignedIn ? (
                <button 
                  onClick={handleNavigation}
                  disabled={isNavigating}
                  className="group px-7 py-3.5 bg-primary text-paper rounded-xl text-base font-semibold hover:bg-primary-light transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 border border-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  {isNavigating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-paper border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Creating</span>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="group px-7 py-3.5 bg-primary text-paper rounded-xl text-base font-semibold hover:bg-primary-light transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 border border-white/10 cursor-pointer">
                    <span>Start Creating</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </SignInButton>
              )}
              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 border border-primary/20 bg-white/70 backdrop-blur-sm text-primary rounded-xl text-base font-semibold hover:border-primary/40 hover:bg-white transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-primary/[0.08]">
              <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <span>Private & Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                <div className="w-5 h-5 rounded-full bg-accent/8 text-accent flex items-center justify-center border border-accent/20">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <span>Takes ~10 Minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                <div className="w-5 h-5 rounded-full bg-document/10 text-document flex items-center justify-center border border-document/20">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>No Payment Required</span>
              </div>
            </div>
          </div>

          {/* Right: Enhanced 3D Document Scene (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center items-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              {/* Radial ambient illumination behind document */}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/8 via-document/5 to-transparent rounded-3xl blur-2xl -z-10"></div>
              
              {/* Main Document Stack with Depth & Floating Levitation Animation */}
              <div 
                className="relative py-4 animate-float-document will-change-transform" 
                style={{ perspective: '1200px' }}
              >
                {/* Document Sheet 3 (Bottom Layer) */}
                <div 
                  className="absolute w-full h-[540px] bg-[#F7F5F0] rounded-2xl shadow-md border border-primary/[0.05] transform rotate-3 translate-x-5 translate-y-5 opacity-50 pointer-events-none"
                  style={{ transformStyle: 'preserve-3d', top: '16px', left: '0' }}
                ></div>
                
                {/* Document Sheet 2 (Middle Layer) */}
                <div 
                  className="absolute w-full h-[540px] bg-[#FAF8F4] rounded-2xl shadow-lg border border-primary/[0.06] transform -rotate-1.5 translate-x-2.5 translate-y-2.5 opacity-75 pointer-events-none"
                  style={{ transformStyle: 'preserve-3d', top: '16px', left: '0' }}
                ></div>
                
                {/* Document Sheet 1 (Top Active Document) */}
                <div 
                  className="relative w-full bg-[#FFFEFC] rounded-2xl shadow-[0_20px_40px_-15px_rgba(15,20,25,0.12)] border border-primary/[0.08] overflow-hidden transform hover:scale-[1.01] transition-all duration-300"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Decorative Document Foil Header */}
                  <div className="bg-primary text-paper px-7 py-5 border-b-2 border-document/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-paper">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-paper font-bold text-lg font-serif tracking-tight">Personal Wishes Document</h3>
                          <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-document/20 text-document-light border border-document/30">
                            Draft Specimen
                          </span>
                        </div>
                        <p className="text-paper/60 text-xs font-sans">Verified Structured State Intake</p>
                      </div>
                    </div>
                    {/* Security watermark mark */}
                    <div className="hidden sm:flex flex-col items-end opacity-70">
                      <span className="text-[9px] font-mono text-paper/70 tracking-wider">REF #LEX-8842</span>
                      <span className="text-[9px] text-paper/50">Jurisdiction: General</span>
                    </div>
                  </div>

                  {/* Document Fields Container with attached information chips */}
                  <div className="p-7 space-y-4">
                    {/* Field 1: Full Name */}
                    <div className="relative group p-3.5 rounded-xl border border-primary/[0.06] bg-background-subtle/50 hover:bg-background-subtle transition-colors flex items-center justify-between">
                      {/* Left attached tag indicator line */}
                      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r"></div>
                      <div className="pl-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-secondary-light">01 / Full Name</p>
                        <p className="text-primary font-semibold text-base font-serif">Rahul Sharma</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2.5 6.5l2.5 2.5 5-5"/>
                        </svg>
                        Confirmed
                      </span>
                    </div>

                    {/* Field 2: Home Address */}
                    <div className="relative group p-3.5 rounded-xl border border-primary/[0.06] bg-background-subtle/50 hover:bg-background-subtle transition-colors flex items-center justify-between">
                      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r"></div>
                      <div className="pl-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-secondary-light">02 / Residence</p>
                        <p className="text-primary font-semibold text-base font-serif">Nagpur, Maharashtra</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2.5 6.5l2.5 2.5 5-5"/>
                        </svg>
                        Confirmed
                      </span>
                    </div>

                    {/* Field 3: Executor */}
                    <div className="relative group p-3.5 rounded-xl border border-primary/[0.06] bg-background-subtle/50 hover:bg-background-subtle transition-colors flex items-center justify-between">
                      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r"></div>
                      <div className="pl-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-secondary-light">03 / Appointed Executor</p>
                        <p className="text-primary font-semibold text-base font-serif">Amit Sharma <span className="text-xs text-secondary-light font-sans font-normal">(Brother)</span></p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2.5 6.5l2.5 2.5 5-5"/>
                        </svg>
                        Confirmed
                      </span>
                    </div>

                    {/* Field 4: Children (Needs Clarification flag) */}
                    <div className="relative p-3.5 rounded-xl border border-amber-300/80 bg-amber-50/40 flex items-center justify-between shadow-2xs">
                      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r"></div>
                      <div className="pl-2">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-amber-700">04 / Beneficiary Children</p>
                        <p className="text-amber-900 font-medium text-sm font-sans flex items-center gap-1.5">
                          <span>Conflicting statements recorded</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Needs Clarification
                      </span>
                    </div>

                    {/* Structured Document Progress Meter */}
                    <div className="pt-4 border-t border-primary/[0.08]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-secondary">Document State Completion</span>
                        <span className="text-xs font-mono font-bold text-primary">3 of 4 Core Fields (75%)</span>
                      </div>
                      <div className="h-2 bg-primary/[0.06] rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-accent via-document to-emerald-600 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Definitions */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-12px) translateX(6px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-16px) translateX(-8px); }
        }

        @keyframes float-document {
          0%, 100% { 
            transform: translateY(0px);
            filter: drop-shadow(0 15px 25px rgba(15, 20, 25, 0.06));
          }
          50% { 
            transform: translateY(-14px);
            filter: drop-shadow(0 28px 38px rgba(15, 20, 25, 0.11));
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-float-document {
          animation: float-document 5.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-document {
            animation: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
