import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton, UserButton } from '@clerk/clerk-react';

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/90 backdrop-blur-md border-b border-primary/[0.08] shadow-[0_4px_20px_-4px_rgba(15,20,25,0.05)]'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-22">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
              aria-label="Lexora Home"
            >
              {/* Distinctive Lexora emblem: Layered geometric L with document precision */}
              <div className="relative w-9 h-9 rounded-lg bg-primary text-paper flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-105 group-hover:bg-primary-light border border-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform duration-300 group-hover:-rotate-3"
                >
                  <path
                    d="M6 4.5V18.5H19"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 8.5V14.5H16"
                    stroke="#B8860B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-primary font-serif">
                  Lexora
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/8 text-accent border border-accent/15">
                  Legal AI
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 bg-background-subtle/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/[0.06]">
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-secondary hover:text-primary hover:bg-white/80 transition-all duration-200 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('product');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-secondary hover:text-primary hover:bg-white/80 transition-all duration-200 cursor-pointer"
            >
              Conflict Detection
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('about');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-secondary hover:text-primary hover:bg-white/80 transition-all duration-200 cursor-pointer"
            >
              Process
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => navigate('/app')}
                  className="px-4 py-2 text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <span>Open Workspace</span>
                </button>
                <div className="h-6 w-px bg-primary/10 mx-1"></div>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="px-5 py-2.5 bg-primary text-paper rounded-xl text-sm font-semibold hover:bg-primary-light transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center gap-2 border border-white/10 cursor-pointer">
                    <span>Start Creating</span>
                  </button>
                </SignInButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg text-primary hover:bg-background-subtle transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-secondary hover:text-primary hover:bg-background-subtle rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('product');
                element?.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-secondary hover:text-primary hover:bg-background-subtle rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
            >
              Conflict Detection
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('about');
                element?.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-secondary hover:text-primary hover:bg-background-subtle rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
            >
              Process
            </button>
            <div className="pt-4 border-t border-primary/10 space-y-3">
              {isSignedIn ? (
                <button
                  onClick={() => {
                    navigate('/app');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-5 py-3 bg-primary text-paper rounded-xl text-base font-semibold text-center shadow-sm"
                >
                  Open Workspace →
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <SignInButton mode="modal">
                    <button className="w-full py-2.5 text-center text-sm font-semibold text-secondary hover:text-primary border border-primary/10 rounded-xl">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="w-full py-3 bg-primary text-paper rounded-xl text-sm font-semibold text-center shadow-md">
                      Start Creating →
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
